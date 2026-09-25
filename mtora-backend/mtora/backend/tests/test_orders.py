from decimal import Decimal
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.pack import Pack


def test_create_order_single_item(client: TestClient):
    """Test creating an order with a single item."""
    # Create a customer
    customer_resp = client.post(
        "/api/v1/customers",
        json={"name": "Vikram Seth", "mobile_no": "9876500001"},
    )
    customer = customer_resp.json()

    # Get packs to know pack1 id
    packs = client.get("/api/v1/packs").json()
    pack1 = next(p for p in packs if p["code"] == "pack1")

    order_payload = {
        "customer_id": customer["id"],
        "payment_mode": "UPI",
        "notes": "Please leave at front door",
        "delivery_slot": "10:00-12:00",
        "delivery_day": "2026-09-15",
        "items": [
            {"pack_id": pack1["id"], "quantity": 2}
        ],
    }
    response = client.post("/api/v1/orders", json=order_payload)
    assert response.status_code == 201
    data = response.json()
    assert data["id"] is not None
    assert data["order_id"].startswith("ORD-")
    assert data["customer_id"] == customer["id"]
    assert data["payment_mode"] == "UPI"
    assert data["order_status"] == "pending"
    # 2 * 45.00 = 90.00
    assert Decimal(str(data["total_amount"])) == Decimal("90.00")
    assert len(data["items"]) == 1
    assert data["items"][0]["pack_id"] == pack1["id"]
    assert data["items"][0]["quantity"] == 2
    assert Decimal(str(data["items"][0]["unit_price"])) == Decimal("45.00")


def test_create_order_multiple_items_and_total_calculation(client: TestClient):
    """
    Test creating order with multiple items and verify total calculation:
    pack2 x 2: 2 * ₹80 = ₹160
    pack1 x 1: 1 * ₹45 = ₹45
    Total: ₹205
    """
    # Create customer
    customer = client.post(
        "/api/v1/customers",
        json={"name": "Neha Sharma", "mobile_no": "9876500002"},
    ).json()

    # Find packs
    packs = client.get("/api/v1/packs").json()
    pack1 = next(p for p in packs if p["code"] == "pack1")  # 45
    pack2 = next(p for p in packs if p["code"] == "pack2")  # 80

    order_payload = {
        "customer_id": customer["id"],
        "payment_mode": "Cash",
        "notes": "Call before arrival",
        "items": [
            {"pack_id": pack2["id"], "quantity": 2},
            {"pack_id": pack1["id"], "quantity": 1},
        ],
    }
    response = client.post("/api/v1/orders", json=order_payload)
    assert response.status_code == 201
    data = response.json()

    # Exact total calculation: (2 * 80) + (1 * 45) = 205
    assert Decimal(str(data["total_amount"])) == Decimal("205.00")
    assert len(data["items"]) == 2

    # Verify each item unit_price
    item_prices = {item["pack_id"]: (item["quantity"], Decimal(str(item["unit_price"]))) for item in data["items"]}
    assert item_prices[pack2["id"]] == (2, Decimal("80.00"))
    assert item_prices[pack1["id"]] == (1, Decimal("45.00"))


def test_invalid_customer_order(client: TestClient):
    """Test 404 error when customer_id does not exist."""
    packs = client.get("/api/v1/packs").json()
    order_payload = {
        "customer_id": 999999,
        "items": [{"pack_id": packs[0]["id"], "quantity": 1}],
    }
    response = client.post("/api/v1/orders", json=order_payload)
    assert response.status_code == 404
    assert "customer" in response.json()["detail"].lower()


def test_invalid_pack_order(client: TestClient):
    """Test 404 error when a pack_id does not exist."""
    customer = client.post(
        "/api/v1/customers",
        json={"name": "Test User", "mobile_no": "9999999999"},
    ).json()

    order_payload = {
        "customer_id": customer["id"],
        "items": [{"pack_id": 999999, "quantity": 1}],
    }
    response = client.post("/api/v1/orders", json=order_payload)
    assert response.status_code == 404
    assert "pack" in response.json()["detail"].lower()


def test_historical_unit_price_preservation(client: TestClient, db_session: Session):
    """
    Test historical price rule:
    When an order is created, order_items stores the unit_price at that time.
    If the pack price changes later, the historical order must still show the original unit_price and total.
    """
    # 1. Create customer
    customer = client.post(
        "/api/v1/customers",
        json={"name": "Ananya Roy", "mobile_no": "9812345678"},
    ).json()

    # 2. Get pack2 (selling price is 80)
    packs = client.get("/api/v1/packs").json()
    pack2 = next(p for p in packs if p["code"] == "pack2")
    assert Decimal(str(pack2["selling_price"])) == Decimal("80.00")

    # 3. Create order with pack2 x 2
    order_resp = client.post(
        "/api/v1/orders",
        json={
            "customer_id": customer["id"],
            "items": [{"pack_id": pack2["id"], "quantity": 2}],
        },
    )
    assert order_resp.status_code == 201
    order_data = order_resp.json()
    order_id = order_data["id"]
    assert Decimal(str(order_data["total_amount"])) == Decimal("160.00")
    assert Decimal(str(order_data["items"][0]["unit_price"])) == Decimal("80.00")

    # 4. Directly update pack2 selling price in database from 80 to 95
    pack_in_db = db_session.get(Pack, pack2["id"])
    pack_in_db.selling_price = Decimal("95.00")
    db_session.commit()

    # 5. Fetch the old order again
    refetched_order = client.get(f"/api/v1/orders/{order_id}").json()

    # 6. Verify the historical order preserved unit_price = 80 and total = 160
    assert Decimal(str(refetched_order["total_amount"])) == Decimal("160.00")
    assert Decimal(str(refetched_order["items"][0]["unit_price"])) == Decimal("80.00")


def test_update_order_status(client: TestClient):
    """Test updating order status fields."""
    customer = client.post(
        "/api/v1/customers",
        json={"name": "Karan Singhania", "mobile_no": "9700012345"},
    ).json()

    packs = client.get("/api/v1/packs").json()
    order = client.post(
        "/api/v1/orders",
        json={
            "customer_id": customer["id"],
            "items": [{"pack_id": packs[0]["id"], "quantity": 1}],
        },
    ).json()

    order_business_id = order["order_id"]

    # Update status using business order_id string
    update_resp = client.put(
        f"/api/v1/orders/{order_business_id}",
        json={
            "order_status": "confirmed",
            "payment_status": "paid",
            "delivery_status": "dispatched",
        },
    )
    assert update_resp.status_code == 200
    updated_data = update_resp.json()
    assert updated_data["order_status"] == "confirmed"
    assert updated_data["payment_status"] == "paid"
    assert updated_data["delivery_status"] == "dispatched"


def test_order_with_empty_items(client: TestClient):
    """Test validation error when creating order with empty items list."""
    customer = client.post(
        "/api/v1/customers",
        json={"name": "Tarun Kapoor", "mobile_no": "9812300000"},
    ).json()

    response = client.post(
        "/api/v1/orders",
        json={"customer_id": customer["id"], "items": []},
    )
    # Pydantic min_length=1 raises 422
    assert response.status_code == 422


def test_custom_order_id_and_duplicate_check(client: TestClient):
    """Test specifying custom order_id and handling duplicates."""
    customer = client.post(
        "/api/v1/customers",
        json={"name": "Deepa Nair", "mobile_no": "9812311111"},
    ).json()
    packs = client.get("/api/v1/packs").json()

    custom_id = "CUSTOM-ORD-001"
    res1 = client.post(
        "/api/v1/orders",
        json={
            "customer_id": customer["id"],
            "order_id": custom_id,
            "items": [{"pack_id": packs[0]["id"], "quantity": 1}],
        },
    )
    assert res1.status_code == 201
    assert res1.json()["order_id"] == custom_id

    # Duplicate should fail with 400
    res2 = client.post(
        "/api/v1/orders",
        json={
            "customer_id": customer["id"],
            "order_id": custom_id,
            "items": [{"pack_id": packs[0]["id"], "quantity": 1}],
        },
    )
    assert res2.status_code == 400
    assert "already exists" in res2.json()["detail"].lower()

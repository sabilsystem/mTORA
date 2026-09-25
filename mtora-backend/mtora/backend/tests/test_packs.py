from decimal import Decimal
from fastapi.testclient import TestClient


def test_get_all_packs(client: TestClient):
    """Test retrieving all seeded packs."""
    response = client.get("/api/v1/packs")
    assert response.status_code == 200
    packs = response.json()
    assert len(packs) == 3

    pack_codes = {p["code"]: p for p in packs}
    assert "pack1" in pack_codes
    assert "pack2" in pack_codes
    assert "pack5" in pack_codes

    # Verify Pack 1: regular 45, selling 45
    p1 = pack_codes["pack1"]
    assert Decimal(str(p1["regular_price"])) == Decimal("45.00")
    assert Decimal(str(p1["selling_price"])) == Decimal("45.00")

    # Verify Pack 2: regular 90, selling 80
    p2 = pack_codes["pack2"]
    assert Decimal(str(p2["regular_price"])) == Decimal("90.00")
    assert Decimal(str(p2["selling_price"])) == Decimal("80.00")

    # Verify Pack 5: regular 180, selling 160
    p5 = pack_codes["pack5"]
    assert Decimal(str(p5["regular_price"])) == Decimal("180.00")
    assert Decimal(str(p5["selling_price"])) == Decimal("160.00")


def test_get_pack_by_id(client: TestClient):
    """Test retrieving single pack by ID."""
    all_packs = client.get("/api/v1/packs").json()
    first_pack = all_packs[0]

    response = client.get(f"/api/v1/packs/{first_pack['id']}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == first_pack["id"]
    assert data["code"] == first_pack["code"]
    assert data["name"] == first_pack["name"]


def test_get_nonexistent_pack(client: TestClient):
    """Test 404 response for non-existent pack."""
    response = client.get("/api/v1/packs/999999")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()

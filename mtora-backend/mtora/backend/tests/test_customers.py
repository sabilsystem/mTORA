from fastapi.testclient import TestClient


def test_health_check(client: TestClient):
    """Test health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_create_customer(client: TestClient):
    """Test creating a customer with phone numbers as strings."""
    payload = {
        "name": "Aarav Sharma",
        "mobile_no": "+919876543210",
        "whatsapp_no": "+919876543210",
        "address": "Flat 402, Green Heights, Bengaluru",
        "location": "Indiranagar",
    }
    response = client.post("/api/v1/customers", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["id"] is not None
    assert data["name"] == "Aarav Sharma"
    assert data["mobile_no"] == "+919876543210"
    assert isinstance(data["mobile_no"], str)
    assert data["whatsapp_no"] == "+919876543210"
    assert data["location"] == "Indiranagar"
    assert "created_at" in data
    assert "updated_at" in data


def test_get_customer_by_id(client: TestClient):
    """Test retrieving a customer by ID."""
    # Create customer first
    payload = {
        "name": "Priya Patel",
        "mobile_no": "9811122233",
        "address": "Koramangala 4th Block",
    }
    created = client.post("/api/v1/customers", json=payload).json()
    customer_id = created["id"]

    response = client.get(f"/api/v1/customers/{customer_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == customer_id
    assert data["name"] == "Priya Patel"
    assert data["mobile_no"] == "9811122233"


def test_get_customers_list(client: TestClient):
    """Test retrieving list of customers."""
    client.post(
        "/api/v1/customers",
        json={"name": "Kavita Rao", "mobile_no": "9845012345"},
    )
    response = client.get("/api/v1/customers")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) >= 1


def test_update_customer(client: TestClient):
    """Test updating customer fields."""
    payload = {
        "name": "Rohit Verma",
        "mobile_no": "9900011223",
        "location": "HSR Layout",
    }
    created = client.post("/api/v1/customers", json=payload).json()
    customer_id = created["id"]

    update_payload = {
        "address": "Plot 12, Sector 2, HSR Layout",
        "location": "HSR Sector 2",
    }
    response = client.put(f"/api/v1/customers/{customer_id}", json=update_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["address"] == "Plot 12, Sector 2, HSR Layout"
    assert data["location"] == "HSR Sector 2"
    assert data["name"] == "Rohit Verma"  # Unchanged field preserved


def test_get_nonexistent_customer(client: TestClient):
    """Test 404 response for non-existent customer."""
    response = client.get("/api/v1/customers/999999")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()

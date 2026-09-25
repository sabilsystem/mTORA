class EntityNotFoundError(Exception):
    """Raised when an entity is not found."""
    def __init__(self, entity_name: str, entity_id: any):
        self.entity_name = entity_name
        self.entity_id = entity_id
        super().__init__(f"{entity_name} with id '{entity_id}' not found")


class BusinessValidationError(Exception):
    """Raised when a business operation fails validation."""
    def __init__(self, message: str):
        self.message = message
        super().__init__(message)

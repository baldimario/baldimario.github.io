---
{
  "title": "Python Domain Driven Design :D",
  "description": "Domain-Driven Design (DDD) is a software development approach that emphasizes aligning the implementation of a system with its business domain. By focusing on the core domain and its logic, DDD helps teams deliver solutions that accurately reflect the business requirements.",
  "image": "https://raw.githubusercontent.com/baldimario/hexagonal-python/refs/heads/develop/logo.png",
  "datetime": "2024/10/24 03:00",
  "author": "Mario Baldi"
}
---

# Domain-Driven Design (DDD) in Python: A Practical Introduction

Domain-Driven Design (DDD) is a software development approach that emphasizes aligning the implementation of a system with its business domain. By focusing on the core domain and its logic, DDD helps teams deliver solutions that accurately reflect the business requirements.

In this post, we’ll explore how to implement DDD principles using Python.

---

## What is Domain-Driven Design?

DDD is based on several key principles:

1. **Ubiquitous Language**: Collaborate with domain experts to create a common language that is used consistently across code, documentation, and conversations.
2. **Bounded Contexts**: Divide the system into distinct domains, each with a clear boundary, to manage complexity.
3. **Entities and Value Objects**: Identify the core concepts of the domain and model them appropriately.
4. **Aggregates**: Group related entities to ensure consistency and encapsulation.
5. **Repositories**: Abstract the storage and retrieval of entities.

---

## Why Use DDD with Python?

Python’s flexibility, readability, and rich ecosystem make it a great fit for implementing DDD. Frameworks like **FastAPI**, **Django**, or **SQLAlchemy** can be used to structure and implement DDD patterns.

---

## Implementing DDD in Python  

### 1. Define the Domain Layer  

The **Domain Layer** models the business logic using entities, value objects, and domain services.  

```python
from dataclasses import dataclass

@dataclass
class Order:
    id: int
    customer_id: int
    total: float

    def calculate_discount(self) -> float:
        # Business logic for discounts
        if self.total > 100:
            return self.total * 0.1
        return 0.0
```
### 2. Use Application Services for Orchestration

The Application Layer handles use cases and interacts with the domain layer.

```python
class OrderService:
    def __init__(self, order_repository):
        self.order_repository = order_repository

    def create_order(self, customer_id, total):
        order = Order(id=None, customer_id=customer_id, total=total)
        self.order_repository.save(order)
        return order
```

### 3. Create a Repository for Data Access

Repositories abstract the data access layer, ensuring that the domain logic isn’t coupled to database operations.

```python
class OrderRepository:
    def __init__(self, db):
        self.db = db

    def save(self, order):
        # Simulate database save
        self.db.append(order)

    def find_by_id(self, order_id):
        # Simulate database lookup
        for order in self.db:
            if order.id == order_id:
                return order
        return None
```

## 4. Add an Infrastructure Layer

The Infrastructure Layer deals with frameworks, databases, and external systems. For instance, using SQLAlchemy for persistence:

```python
from sqlalchemy import Column, Integer, Float, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

class OrderModel(Base):
    __tablename__ = 'orders'

    id = Column(Integer, primary_key=True)
    customer_id = Column(Integer)
    total = Column(Float)
```

## Structuring Your Project

Here’s a sample folder structure for a Python project using DDD:

```
src/
+-- domain/
|   +-- entities.py
|   +-- value_objects.py
|   +-- services.py
+-- application/
|   +-- services.py
+-- infrastructure/
|   +-- repositories.py
|   +-- models.py
+-- main.py
```

## Benefits of DDD in Python

1. Improved Communication: The ubiquitous language bridges the gap between developers and domain experts.
2. Scalability: Modular design makes it easier to scale and maintain the system.
3. Focus on Business Logic: DDD ensures the core business logic isn’t diluted by technical concerns.

## Conclusion

Domain-Driven Design provides a structured approach to building complex systems by focusing on the business domain. Python’s simplicity and rich ecosystem make it an ideal language for implementing DDD.

Start small, focus on the core principles, and evolve your implementation as the domain grows!


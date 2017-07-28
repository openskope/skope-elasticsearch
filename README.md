# SKOPE Deployments

SKOPE is a basic microservice architecture with with each service running
within container. At the center of the backend services is Clowder, a Data 
Management System (DMS) designed to manage large collections of scientific
data. Clowder can be extended using addition microservices known as extractors.
Like many microservice system, Clowder depends on RabbitMQ to handle
notifications of new data sets, file uploads, or metadata changes.

![SKOPE Architecture](docs/skope_architecture.png?raw=true "SKOPE Architecture")

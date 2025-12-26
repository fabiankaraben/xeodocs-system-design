---
trigger: always_on
---

- The project website domain is xeodocs.com
- The website/app name is XeoDocs
- The repository project name is xeodocs-system-design
- Never remove the .windsurf directory

- Always use snake_case for database table fields

- This repository is only for design in markdown (with mermaid support) and OpenAPI formats, don't write code here

- Always write the content and comments in English, even when the prompt is not in English.

API:
- Always use camelCase for API field keys in requests and responses
- All API responses must include the `data` field. If it's a list, it must include pagination and filtering.
- Never return a null value for a list. If there are no items, return an empty array `[]`.
- Never return a `success` field; this is redundant with respect to the status code.
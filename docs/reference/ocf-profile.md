# OCF Profile v1.0 Specification

The **OCF Profile** is a strict, domain-specific implementation of the Open Knowledge Format (OKF). While OKF defines the general layout (Markdown + YAML frontmatter in a directory structure), the OCF Profile enforces semantic schemas specifically for career management.

## Base OKF Requirements

Every document in an OCF Profile bundle MUST contain the following YAML frontmatter:

- `type` (string, required): The core entity type. Must be one of the registered OCF Profile types.
- `schemaVersion` (string, required): MUST be `ocf.profile/v1`.
- `title` (string, optional): A human-readable title.
- `description` (string, optional): A brief summary.
- `timestamp` (string, optional): ISO 8601 timestamp of last modification.
- `tags` (array of strings, optional): Categorization keywords.

## Registered Types

The OCF Profile v1 defines exactly 7 document types. Any other `type` is considered invalid.

### 1. Skill (`skills/*.md`)
Models technical, soft, and core competencies.
- `level` (string, required): "Beginner", "Intermediate", "Advanced", or "Expert".
- `yearsOfExperience` (number, required): Years of practical application.
- `category` (string, optional): High-level grouping (e.g., "Frontend", "Leadership").

### 2. Experience (`experiences/*.md`)
Models professional job history.
- `company` (string, required): Employer name.
- `role` (string, required): Job title.
- `startDate` (string, required): ISO 8601 date.
- `endDate` (string, optional): ISO 8601 date. Required if not current.
- `current` (boolean, optional): True if currently employed here.
- `location` (string, optional): Geographical or "Remote" location.

### 3. Education (`education/*.md`)
Models academic credentials.
- `institution` (string, required): School/University name.
- `degree` (string, required): "Bachelor's", "Master's", etc.
- `field` (string, optional): Area of study.
- `startDate` (string, optional): ISO 8601 date.
- `endDate` (string, optional): ISO 8601 date.
- `location` (string, optional): Geographical location.

### 4. Certificate (`certificates/*.md`)
Models verifiable industry certifications.
- `issuer` (string, required): Issuing organization.
- `dateObtained` (string, optional): ISO 8601 date.
- `expirationDate` (string, optional): ISO 8601 date.
- `credentialId` (string, optional): Verification ID.
- `url` (string, optional): Link to verify credential.

### 5. Project (`projects/*.md`)
Models portfolio items and OSS contributions.
- `url` (string, optional): Repository or live project link.
- `technologies` (array of strings, optional): Key tech stack used.
- `startDate` (string, optional): ISO 8601 date.
- `endDate` (string, optional): ISO 8601 date.

### 6. Preference (`preferences/*.md`)
Models target search constraints.
- `locations` (array of strings, optional): Desired geographical locations.
- `remote` (boolean, optional): Willingness for remote work.
- `salaryRange` (string, optional): Target compensation.
- `roles` (array of strings, optional): Target job titles.
- `companySize` (string, optional): "Startup", "Enterprise", etc.

### 7. Application (`applications/*.md`)
Models submitted job applications (pipeline).
- `platform` (string, optional): "LinkedIn", "Gupy", etc.
- `status` (string, required): "Saved", "Applied", "Screening", "Interview", "Offer", "Rejected", "Withdrawn".
- `appliedAt` (string, optional): ISO 8601 date.
- `url` (string, optional): Link to the original job posting.

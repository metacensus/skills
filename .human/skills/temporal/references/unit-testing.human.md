# Unit Testing Strategy

Workflows mock activities; activities mock clients; clients run real systems. Every workflow needs tests for replay safety. Shared principles: explicit names, validation first, direct mocks only, independent cases, conditional mocks, real errors.

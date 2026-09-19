# The domain types

The nouns, in code. What they ARE and why they are this shape:
[`docs/architecture/domain-model.md`](../../docs/architecture/domain-model.md).

Nothing in here imports from `src/adapters/` or from any UI. The dependency runs one way: adapters
and UI know about the domain, the domain knows about neither.

These types are also the contract Noma re-serves through the standard interfaces, so a field
dropped here is a field that cannot be given back — see domain-model point 8, *keep what we were
given, exactly*.

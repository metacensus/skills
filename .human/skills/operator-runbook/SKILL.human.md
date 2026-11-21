> The person runs; the agent reads.

Fires: `terraform apply`, AWS, Cloudflare, DNS, GitHub App, `gh secret set`, a classifier refusal, "one at a time".

```
Identity → Command → ⛔ Paste → Check → Next
```

Secrets: never asked, printed, or repeated; a leak means rotate next.

| Symptom | Run |
|---|---|
| expired SSO | `aws sso login` |
| state lock | `terraform force-unlock`, once no other run holds it |
| wrong kube context | `kubectl config use-context` |

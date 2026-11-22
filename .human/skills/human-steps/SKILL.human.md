> One step per turn; the next waits until this one is checked.

Fires: walking through code or a PR; `terraform apply`, AWS, Cloudflare, DNS, GitHub App, `gh secret set`, a classifier refusal; "one at a time"; queued questions.

```
Step → ⛔ reply → check → next
```

| Steps | One step | Checked by |
|---|---|---|
| Code | a 10–30 line block, bottom up | continue · deeper · skip · question |
| Commands | one command, identity check first | the pasted output |
| Questions | one question, lettered, with a default | the read-back left standing |

Code: what each block does, and what breaks without it; nothing changes unless asked.

Secrets: never asked, printed, or repeated; a leak means rotate next.

| Symptom | Run |
|---|---|
| expired SSO | `aws sso login` |
| state lock | `terraform force-unlock`, once no other run holds it |
| wrong kube context | `kubectl config use-context` |

Questions: each answer recorded as a `Decision:` in the person's words; a skip takes the default.

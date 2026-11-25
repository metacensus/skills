> The tiers that change production, read when work ships in, adopts or waits on one.

|Tier|Size|Carrier|Delegator|
|---|---|---|---|
|Publish|one version of one repo, closed once served|`sdlc-cut`|`sdlc-ship`, else a person|
|Release|optional, where Publishes must hold order or rollback as one, an apply is one-way, or a yes needs its own record|`sdlc-ship`|`sdlc-campaign`, else a person|
|Rollout|optional, where Releases need ordering|`sdlc-campaign`|a person|

Plan → Change → Verify

An apply is a Publish of desired state, served once the live plan is empty; its Tasks close on merge and block it, and what needs the applied effect waits on it. Work relates to one by `blocked by` alone: a Publish is blocked by the Epic it ships, or a Task where its Epic ships apart; a consumer's adoption is blocked by it. No Epic both blocks a Publish and waits on it or its Release. Versions are fixed and appended, so work moves later; renumbering is rare. An Initiative mentions its Releases, is never blocked by one, and closes after its Publishes and their Releases.

Joining: the earliest open Publish that holds, the next filed if none; versions compared within one repo.

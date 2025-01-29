## US Chess Federation Member Lookup (uschess.org)

### What does USCF Member Lookup do?

This actor scrapes public member information from uschess.org given a member ID.

### Why use this actor?

This actor is useful as uschess.org offers no API for accessing this public information, while chess clubs around the world rely on its up-to-date information to check a player's ratings and eligibility for participation in tournaments. uschess.org offers member information in a (abliet archaic) table-like format. The organization of said table is quite bespoke, though. They often combine multiple data points in the same table cell, creating tedious parsing requirements. They also like to use inconsistent data types in each field, for example the member's expiration date is usually `2026-01-31` but occasionally it will say stuff like `LIFETIME`, for grandmaster for example. Also, if a member has no rank in a certain category, it will say `(UNRATED)` instead of a number. You will definitely want to consider this when consuming the actor.

### How do I use this actor?

Currently this actor takes a single input, the member ID.

```json
{
    "id": "12345"
}
```

and it creates a dataset in this shape:

```json
[
    {
        "12345678": {
            "general": {
                "Regular Rating": "1300",
                "Quick Rating": "1200",
                "Blitz Rating": "(Unrated)",
                "Online-Regular Rating": "(Unrated)",
                "Online-Quick Rating": "(Unrated)",
                "Online-Blitz Rating": "(Unrated)",
                "Overall Ranking": "16900(Tied)",
                "Correspondence Rating": "(Unrated)",
                "State": "MA",
                "Gender": "M",
                "Name": "PLAYER NAME",
                "ID": "12345678",
                "Expiration Dt.": "2026-01-30",
                "Last Change Dt.": "2025-01-26"
            }
        }
    }
]
```

### Compatibilty

Please note that uschess.org's member lookup site is very old and hasn't been visually updated in awhile. Specifically, this Actor was built targeting `Version 1.00b / 2003-10-16`. If this changes, which seems unlikely, this actor will be promptly updated to remain operational. Please leave an issue here if anything doesn't work or contact me at inbox@dejean.dev! Also note, their site's pretty slow. It could take up to a few seconds to recieve data.

### Roadmap

This actor is undergoing development.

Implemented:

- General tab (most basic info, see example dataset above)

Not yet implemented:

- More tab (milestones)
- Rating Supplement tab (entries)
- Tournament Director tab (if member can host tournaments)
- Tournament History tab (entries)

For efficieny's sake, I also plan to create input parameters to restrict scaped data. For now all player data is collected.

### Feedback

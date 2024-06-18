# Entrance System

We want to support 24h access using RFID tags which are paired with some kind of pass type.

### Pass Types

- Time pass: Access is granted for some period (1 month, 1 year, ...)
- Session pass: Access is granted for a given number of days (10, 30, ...)

The internal code will look something like this:

```rust
// This means an account can support 2 rfid tags.
const MAX_RFID: usize = 2;

struct TimePass { expiry_date: Date };
struct SessionPass { session_left: u8 };
// rfid tags contain 7-byte ids
type RFID = [u8; 7];

struct User {
  id: u64,
  rfids: [RFID; MAX_RFID],
  time_pass: Option<TimePass>,
  session_pass: Option<SessionPass>,
}

impl User {
  fn new(tag_id: u64) -> Self { ... }
  fn add_timepass(&mut self, pass: TimePass) -> Result<()> { ... }
  fn add_sessionpass(&mut self, pass: SessionPass) -> Result<()> { ... }
  fn allowed_access(&self) -> bool {
    // We allow for 2 passes to be held at the same time.
    match (self.time_pass, self.session_pass) {
      (Some(time_pass), Some(session_pass)) => {
        // We default to using the time pass if they have one.
        if time_pass.is_valid() { true }
        else if session_pass.is_valid() {
          /* Use session pass */
          true
        } else {
          false
        }
      },
      (Some(pass), None) => pass.is_valid(),
      (None, Some(pass)) => pass.is_valid(),
      _ => false,
    }
  }
}

// An example user who has never bought a pass.
let john = User::new();
// When he buys a time pass with 100 days, we update his account.
john.add_timepass(Pass::Time(100));
// When he we scan an rfid which matches his account, we open the door if
// One of johns passes are valid.
if john.allowed_access() { /* Send valid signal */ } else {/* Send invalid signal */}
```

### Google Wallet Integration

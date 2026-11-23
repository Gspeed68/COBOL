# COBOL Hello World Application

A simple COBOL program that demonstrates basic input/output operations by asking for a user's name and displaying a personalized greeting.

## Description

This program is a basic example of COBOL programming that shows:
- Basic program structure
- Variable declaration
- User input handling
- Screen output
- Program documentation

## Requirements

- GnuCOBOL compiler (version 3.2.0 or later)
- Unix-like operating system (macOS, Linux)

## Installation

1. Install GnuCOBOL:

   **macOS (using Homebrew):**
   ```bash
   brew install gnucobol
   ```

   **Linux (Ubuntu/Debian):**
   ```bash
   sudo apt-get install gnucobol
   ```

## Building and Running

1. Compile the program:
   ```bash
   cobc -x hello_world.cbl
   ```

2. Run the program:
   ```bash
   ./hello_world
   ```

## Program Structure

The program consists of three main divisions:

1. **IDENTIFICATION DIVISION**
   - Contains program identification information
   - Required in every COBOL program

2. **DATA DIVISION**
   - Contains the WORKING-STORAGE SECTION
   - Defines the USER-NAME variable (20 characters maximum)

3. **PROCEDURE DIVISION**
   - Contains the executable instructions
   - Handles user input and output

## Example Usage

```
Please enter your name: John
HELLO John
```

## Notes

- The program accepts names up to 20 characters in length
- Input is case-sensitive
- The program will display the greeting immediately after receiving the name input

## License

This project is open source and available under the MIT License. 

---

# Hogan Core Console (AriesGate Tech)

`hogan-console/index.html` is a single-page teaching app. You type a banking request on the left, and the right side shows, line by line, the COBOL (plus CICS, JCL, MQ, APIM policy and ISO 20022) that a Hogan-style core would run to process it.

Open `hogan-console/index.html` in any browser. It needs no build step and no server. Add `?nosplash` to skip the splash screens, or `?s=xfer`, `?s=tdn` or `?s=apim` to open a specific scenario.

| Tab | Transaction / program | What it shows |
|---|---|---|
| DDA Maintenance | `IDM1` / `IDSDM100` | Status, overdraft limit, statement address or hold changes on the IDS DDA master: READ UPDATE, edits, REWRITE, audit TD queue, CIF memo, SYNCPOINT or ROLLBACK |
| DDA → DDA Transfer | `IXF1` / `IDSXF200` | Ordered record locks (no deadlocks), available balance + overdraft check, debit and credit in one unit of work, journal entries, and the `IDSNITE` JCL that hard-posts them tonight |
| Tokenized Network | `ITK1` / `TDNXF300` | MINT (DDA → BDA → CDA tokens), BURN (CDA → BDA → DDA) and XFER (CDA → CDA) with MQ calls to a TDN gateway, the token contract call, and a reserve check that BDA = tdUSD supply |
| Orchestrator + APIM | `PAYPOST1` | A third party calls Azure API Management (validate-jwt, rate limit), the payments orchestrator screens and routes, Hogan debits over MQ, then pacs.008 (RTP / FedNow / Wire) or a NACHA entry (ACH) goes to the rail |

**Glossary:** DDA = demand deposit account. BDA = Bank Deposit Account, the bank's omnibus reserve that backs every token. CDA = Custody Deposit Account, the customer's tokenized position.

Things to try: anything on Jordan Patel (frozen), closing an account with money in it, a transfer bigger than available + overdraft, minting with no CDA (it onboards one), an expired OAuth token, a creditor named "Acme Shell Co" (sanctions hold), or more than $25,000 on an instant rail.

Balances persist in the browser (localStorage). **Reset demo data** puts them back.

> Teaching simulation. Hogan is a trademark of DXC Technology; this project is independent and not affiliated with DXC. Program names, transaction codes, record layouts, partners, people and the bank are made up. Nothing connects to a real core, network or rail.

**Smoke test:** `npm i -D playwright && npx playwright install chromium && node hogan-console/tests/smoke.mjs`

**Deploy:** `netlify.toml` publishes `hogan-console/` as the site root.

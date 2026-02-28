# Bandit - Level 19 → Level 20  
**Challenge name:** Using a setuid binary to read the next password  
**Date:** 23 Feb 2026  
**Time spent:** ~5 mins  
**Difficulty:** Easy

---

## Level Goal
To gain access to the next level, you should use the setuid binary in the homedirectory. Execute it without arguments to find out how to use it. The password for this level can be found in the usual place (`/etc/bandit_pass`), after you have used the setuid binary.

Helpful Reading Material
[setuid on Wikipedia](https://en.wikipedia.org/wiki/Setuid)

---

## Approach (step-by-step):

1. **Connect to the server** using credentials from previous level:
  ```bash
    ssh bandit19@bandit.labs.overthewire.org -p 2220
  ```

2. **List files and check permissions:**
  ```bash
    ls -l
  ```
  You will see a binary called `bandit20-do` with the setuid bit set (`-rwsr-x---`). This means it can execute with the privileges of another user (`bandit20`).

3. **Run the binary without arguments** to see usage instructions:
  ```bash
    ./bandit20-do
  ```
  It outputs something like:
  ```bash
    Run a command as another user.
    Example: ./bandit20-do whoami
  ```

4. **Test the binary with a command** to see which user it executes as:
  ```bash
  ./bandit20-do whoami
  ```
  Output should be `bandit20`, indicating the binary runs commands as the next user.

5. **Use the binary to read the next level password:**
  ```bash
    ./bandit20-do cat /etc/bandit_pass/bandit20
  ```
  This prints the password for `bandit20`.

---

##  Commands & Outputs:
```bash
$ ssh bandit19@bandit.labs.overthewire.org -p 2220          #pass: cGWpMaKX************************
... (banner) ...
bandit19@bandit:~$ ls
bandit20-do
bandit19@bandit:~$ ls -l
total 16
-rwsr-x--- 1 bandit20 bandit19 14884 Oct 14 09:26 bandit20-do
bandit19@bandit:~$ ./bandit20-do
Run a command as another user.
  Example: ./bandit20-do whoami
bandit19@bandit:~$ ./bandit20-do whoami
bandit20        # current user can read current level pass stored in /etc/bandit_pass directory
bandit19@bandit:~$ ./bandit20-do cat /etc/bandit_pass/bandit20
0qXahG8Z************************
bandit19@bandit:~$
```

---

## Flags / result
- password: `0qXahG8Z************************`  
    Use it to login:
```bash
ssh bandit20@bandit.labs.overthewire.org -p 2220
```

## Password Notice
For security and in accordance with OverTheWire rules, the actual password for the next level is **censored** in this write‑up.  
Use the steps shown above to retrieve it in your own environment.

---

## References
- [OverTheWire — Bandit level descriptions and hints](https://overthewire.org/wargames/bandit/bandit20.html)

---

## Reading materials
- `man ls`, `man cat`, `man ssh` – for listing files, reading contents, and connecting via SSH.
- [setuid on Wikipedia](https://en.wikipedia.org/wiki/Setuid)
# Bandit - Level 18 → Level 19  
**Challenge name:** Bypass logout and read file  
**Date:** 20 Feb 2026  
**Time spent:** ~5 mins  
**Difficulty:** Easy

---

## Level Goal
The password for the next level is stored in a file **readme** in the homedirectory. Unfortunately, someone has modified `.bashrc` to log you out when you log in with SSH.

---

## Commands you may need to solve this level
ssh, ls, cat
> Tips: Not familiar with a command? Use `man <command>` to learn about it.

---

## Approach (step-by-step):
1. **Connect to the server** using the credentials from previous level:
  ```bash
    ssh bandit18@bandit.labs.overthewire.org -p 2220
  ```
  **Problem:** You will be immediately logged out and see `Byebye!`. This happens because `.bashrc` is configured to log you out automatically.

2. **Bypass** `.bashrc` when running a command:
  SSH allows executing a single command without starting an interactive shell, which bypasses the problematic `.bashrc`.
  ```bash
    ssh bandit18@bandit.labs.overthewire.org -p 2220 "cat ~/readme"
  ```
  This command prints the contents of the `readme` file, which contains the password for the next level.

3. **Copy the password** and save it for login into `bandit19`.

---

##  Commands & outputs:
```bash
$ ssh bandit18@bandit.labs.overthewire.org -p 2220      # pass: x2gLTTjF************************
... (banner) ...
  Enjoy your stay!

Byebye !
Connection to bandit.labs.overthewire.org closed.

$ man ssh
$ ssh bandit18@bandit.labs.overthewire.org -p 2220 "cat ~/readme"
                         _                     _ _ _
                        | |__   __ _ _ __   __| (_) |_
                        | '_ \ / _` | '_ \ / _` | | __|
                        | |_) | (_| | | | | (_| | | |_
                        |_.__/ \__,_|_| |_|\__,_|_|\__|


                      This is an OverTheWire game server.
            More information on http://www.overthewire.org/wargames

backend: gibson-0
bandit18@bandit.labs.overthewire.org's password:
cGWpMaKX************************
$ echo cGWpMaKX************************ > bandit19
```

---

## Flags / result
- password: `cGWpMaKX************************`  
    Use it to login:
```bash
ssh bandit19@bandit.labs.overthewire.org -p 2220
```

## Password Notice
For security and in accordance with OverTheWire rules, the actual password for the next level is **censored** in this write‑up.  
Use the steps shown above to retrieve it in your own environment.

---

## References
- [OverTheWire — Bandit level descriptions and hints](https://overthewire.org/wargames/bandit/bandit19.html)

---

## Reading materials
- `man ssh` – for running commands remotely and bypassing login scripts
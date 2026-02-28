# Bandit - Level 21 → Level 22  
**Challenge name:** Reading cron job configuration  
**Date:** 28 Feb 2026  
**Time spent:** ~7 mins  
**Difficulty:** Easy

---

## Level Goal
A program is running automatically at regular intervals from cron, the time-based job scheduler. Look in `/etc/cron.d/` for the configuration and see what command is being executed.

## Commands you may need to solve this level
cron, crontab, crontab(5) (use “man 5 crontab” to access this)

---

## Approach (step-by-step):
1. **Connect to the server**
```bash
ssh bandit21@bandit.labs.overthewire.org -p 2220
```

2. **Inspect cron directory**
    Trying to read it directly:
    ```bash
        cat /etc/cron.d
    ```
    You’ll see:
    ```bash
        Is a directory
    ```
    So list its contents:
    ```bash
    ls /etc/cron.d
    ```    
    Look for relevant cron jobs. You’ll find:
    ```bash
        cronjob_bandit22
    ```
3. **Read the cron job file**
    ```bash
        cat /etc/cron.d/cronjob_bandit22
    ```
    Output:
    ```bash
    @reboot bandit22 /usr/bin/cronjob_bandit22.sh &> /dev/null
    * * * * * bandit22 /usr/bin/cronjob_bandit22.sh &> /dev/null
    ```
    What this means:
- It runs as user `bandit22`
- It executes `/usr/bin/cronjob_bandit22.sh`
- It runs every minute (`* * * * *`)
- Output is suppressed (`&> /dev/null`)

4. **Inspect the script being executed**

    Check permissions:
    ```bash
        ls -l /usr/bin/cronjob_bandit22.sh
    ```
    Read the script:
    ```bash
        cat /usr/bin/cronjob_bandit22.sh
    ```
    Output:
    ```bash
        #!/bin/bash
        chmod 644 /tmp/t7O6lds9S0RqQh9aMcz6ShpAoZKF7fgv
        cat /etc/bandit_pass/bandit22 > /tmp/t7O6lds9S0RqQh9aMcz6ShpAoZKF7fgv
    ```

5. **Understand What’s Happening**

    Every minute:
- It changes permissions of a file in `/tmp`
- It copies the password of bandit22 into that file
- Makes it readable (644)
    So we simply read that file:
    ```bash
        cat /tmp/t7O6lds9S0RqQh9aMcz6ShpAoZKF7fgv
    ```
---

##  Commands & outputs:
```bash
$ ssh bandit21@bandit.labs.overthewire.org -p 2220          #pass: EeoULMCr************************
... (banner) ...
bandit21@bandit:~$ 
bandit21@bandit:~$ ls
bandit21@bandit:~$ cat /etc/cron.d
cat: /etc/cron.d: Is a directory

bandit21@bandit:~$ ls /etc/cron.d
behemoth4_cleanup  clean_tmp  cronjob_bandit22  cronjob_bandit23  cronjob_bandit24  e2scrub_all  leviathan5_cleanup  manpage3_resetpw_job  otw-tmp-dir  sysstat

bandit21@bandit:~$ cat /etc/cron.d/cronjob_bandit22
@reboot bandit22 /usr/bin/cronjob_bandit22.sh &> /dev/null
* * * * * bandit22 /usr/bin/cronjob_bandit22.sh &> /dev/null

bandit21@bandit:~$ ls -l /usr/bin/cronjob_bandit22.sh
-rwxr-x--- 1 bandit22 bandit21 130 Oct 14 09:26 /usr/bin/cronjob_bandit22.sh

bandit21@bandit:~$ cat /usr/bin/cronjob_bandit22.sh
#!/bin/bash
chmod 644 /tmp/t7O6lds9S0RqQh9aMcz6ShpAoZKF7fgv
cat /etc/bandit_pass/bandit22 > /tmp/t7O6lds9S0RqQh9aMcz6ShpAoZKF7fgv

bandit21@bandit:~$ cat /tmp/t7O6lds9S0RqQh9aMcz6ShpAoZKF7fgv
tRae0UfB************************            # pass for bandit22
bandit21@bandit:~$
```

---

## Flags / result
- password: `tRae0UfB************************`  
    Use it to login:
```bash
ssh bandit21@bandit.labs.overthewire.org -p 2220
```

## Password Notice
For security and in accordance with OverTheWire rules, the actual password for the next level is **censored** in this write‑up.  
Use the steps shown above to retrieve it in your own environment.

---

## Key Concepts Learned

- How cron jobs work
- Reading `/etc/cron.d`
- Understanding cron timing syntax (`* * * * *`)
- Output redirection (`&> /dev/null`)
- How automated scripts can accidentally expose sensitive data

---

## References
- [OverTheWire — Bandit level descriptions and hints](https://overthewire.org/wargames/bandit/bandit22.html)

---

## Reading materials
- `man 5 crontab`
- `man cron`
- Understanding Linux file permissions (`chmod 644`)
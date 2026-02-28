# Bandit - Level 20 → Level 21  
**Challenge name:** Local port authentication with setuid binary  
**Date:** 27 Dec 2026  
**Time spent:** ~10 mins  
**Difficulty:** Medium (conceptual)

---

## Level Goal
There is a **setuid binary** in the homedirectory that does the following: it makes a connection to localhost on the port you specify as a commandline argument. It then reads a line of text from the connection and compares it to the password in the previous level (bandit20). If the password is correct, it will transmit the password for the next level (bandit21).

NOTE: Try connecting to your own network daemon to see if it works as you think

---

## Commands you may need to solve this level
ssh, nc, cat, bash, screen, tmux, [Unix ‘job control’](https://en.wikipedia.org/wiki/Job_control_(Unix)) (bg, fg, jobs, &, CTRL-Z, …)

---

## Understanding the Challenge

The binary:
    ```bash
        ./suconnect <port>
    ```
- Connects to localhost:<port>
- Waits for the correct password
- If correct → sends next password back through that connection

So we must:
1. Start a **server** listening on a port (using `nc`)
2. Send the current password
3. Let `suconnect` connect to us
4. Receive the next password

---

## Approach 1 — Using Two Terminals (Simple & Clear):
1. **Connect to bandit20**
    ```bash
        ssh bandit20@bandit.labs.overthewire.org -p 2220
    ```
2. Check the binary:
    ```bash
        ls -l
        # output:  -rwsr-x--- 1 bandit21 bandit20 ... suconnect
    ```

3. **Terminal 1 — Start a netcat server**

4. Get current password:
    ```bash
        cat /etc/bandit_pass/bandit20
    ```

5. Start listening on a port (example: 30099):
    ```bash
        nc -l -p 30099
    ```
    Paste the bandit20 password and press Enter.
    Leave this terminal running.

6. **Terminal 2 — Run suconnect**
    ```bash
        ./suconnect 30099
    ```
    Output:
    ```bash
        Read: 0qXahG8ZjOVMN9Ghs7iOWsCfZyXOUbYO
        Password matches, sending next password
    ```

7. **Back to Terminal 1**
    You will now see:
    ```bash
        EeoULMCr************************
    ```
    That is the password for bandit21.

## Approach 2 — Using Background Jobs (Cleaner Method):

1. Instead of two terminals, run `nc` in background:
    ```bash
        cat /etc/bandit_pass/bandit20 | nc -l -p 40099 &
    ```

2. Check running jobs:
    ```bash
        jobs
    ```

3. Then run:
    ```bash
        ./suconnect 40099
    ```
    Output:
    ```bash
        Read: 0qXahG8ZjOVMN9Ghs7iOWsCfZyXOUbYO
        Password matches, sending next password
        EeoULMCr************************
    ```
    The job will complete automatically.

---

##  Commands & outputs:
```bash
$ ssh bandit20@bandit.labs.overthewire.org -p 2220          #pass: 0qXahG8Z************************
... (banner) ...
bandit20@bandit:~$ ls
suconnect
bandit20@bandit:~$ ls -l
total 16
-rwsr-x--- 1 bandit21 bandit20 15608 Oct 14 09:26 suconnect
bandit20@bandit:~$ ./suconnect
Usage: ./suconnect <portnumber>
This program will connect to the given port on localhost using TCP. If it receives the correct password from the other side, the next password is transmitted back.
bandit20@bandit:~$          # follow Solution 1 or 2

####--- Solution 1 Starts---#### 
# To solve this challenge one way is to Open two terminal side-by-side logged in to `bandit20`:
#    ****Terminal 1:****
    bandit20@bandit:~$ cat /etc/bandit_pass/bandit20
    0qXahG8ZjOVMN9Ghs7iOWsCfZyXOUbYO
    bandit20@bandit:~$ nc -l -p 30099       # Start netcat server to listen on any port
    0qXahG8ZjOVMN9Ghs7iOWsCfZyXOUbYO        # Paste the password of bandit20 and press enter
                                            # leave it running

#    ****Terminal 2:****(After done with terminal 1)
    bandit20@bandit:~$ ./suconnect 30099    # the nc server listening port number
    Read: 0qXahG8Z************************
    Password matches, sending next password
    bandit20@bandit:~$  

#    ****Terminal 1:****(Password sent from terminal 1 to terminal 2)
    bandit20@bandit:~$ nc -l -p 30099
    0qXahG8Z************************
    EeoULMCr************************        # password for bandit21 recieved
    bandit20@bandit:~$   
####--- Solution 1 Ends ---####                    

####--- Solution 2 Starts ---####  
# Another way is to run `nc` in the background, so we can use the same terminal:
    bandit20@bandit:~$ cat /etc/bandit_pass/bandit20
    0qXahG8Z************************
    bandit20@bandit:~$ cat /etc/bandit_pass/bandit20 | nc -l -p 40099 &     # use any open port
    [1] 34                                                                  # '&' used to run jobs in the background
    bandit20@bandit:~$ jobs                 # used to check running jobs
    [1]+  Running                 cat /etc/bandit_pass/bandit20 | nc -l -p 40099 &
    bandit20@bandit:~$ ./suconnect 40099
    Read: 0qXahG8Z************************
    Password matches, sending next password
    EeoULMCr************************        # password for bandit21 recieved
    [1]+  Done                    cat /etc/bandit_pass/bandit20 | nc -l -p 40099
    bandit20@bandit:~$
####--- Solution 2 Ends ---####
```

---

## Flags / result
- password: `EeoULMCr************************`  
    Use it to login:
```bash
ssh bandit21@bandit.labs.overthewire.org -p 2220
```

## Password Notice
For security and in accordance with OverTheWire rules, the actual password for the next level is **censored** in this write‑up.  
Use the steps shown above to retrieve it in your own environment.

---

## Key Concepts Learned

- Localhost TCP communication
- Using `nc` (netcat) as a simple TCP server
- How setuid programs can execute with elevated privileges
- Unix job control (`&`, `jobs`)
- Understanding client-server interaction

---

## References
- [OverTheWire — Bandit level descriptions and hints](https://overthewire.org/wargames/bandit/bandit21.html)

---

## Reading materials
- `man nc`
- `man bash`
- Unix Job Control
- Understanding TCP localhost communication
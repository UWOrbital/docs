---
title: Sending commands to the board
description: A guide on how to use the ground station CLI python tool to execute commands on the OBC board
sidebar:
  order: 1 
---

# Connecting to the OBC CLI Through WSL2

This guide explains how to connect to the OBC board CLI through WSL2 or Linux using the Ground Station CLI.

---

# Quick Reference (Steps Needed Every Time)

> If this is your first time setting this up, jump to [First-Time Setup](#first-time-setup) first.

## 1. Activate the Python Virtual Environment

Follow the repository setup instructions and ensure the Python virtual environment is activated.

---

## 2. Connect the OBC Board

Connect the OBC board (Launchpad, Revisions, etc.) to your laptop through USB.

---

## 3. Ensure Firmware is Flashed

Ensure the board is flashed with:

- `main`, or
- another branch where `app_main.c` starts the task scheduler and communication FreeRTOS tasks.

This can be flashed using TI UniFlash.

- [Flashing guide](/docs/fw-build/flashing)

---

## 4. Forward the USB Device to WSL2 (WSL2 Only)

> Skip this section if you are booting directly into Linux.

### Important Notes

- Ensure PuTTY or any other serial monitor is closed.
- Only one process can access a serial port at a time.

### Open PowerShell as Administrator

Run:

```powershell
usbipd list
```

Look for the **XDS110** device and note the BUSID.

Example:

```text
BUSID  DEVICE
5-2    Texas Instruments XDS110
```

### Attach the USB Device to WSL2

Run:

```powershell
usbipd attach --wsl --busid 5-2
```

Replace `5-2` with your actual BUSID.

> You must repeat this step every time you unplug and reconnect the USB device.

---

## 5. Find the Linux Serial Port

Inside WSL2, run:

```bash
cd /dev
ls
```

Look for either:

- `ttyUSB0`
- `ttyACM0`

If multiple exist, try each one.

---

## 6. Launch the Ground Station CLI

Navigate to the root of the orbital repository with the CLI, and run:

```bash
python -m obc.tools.cli.ground_station_cli /dev/ttyUSB0
```

Or:

```bash
python -m obc.tools.cli.ground_station_cli /dev/ttyACM0
```

As of July 11, 2026, the module path is:

```text
obc/tools/cli/ground_station_cli

```

---

## 7. Send a ping command

With the CLI open, you can enter help to see each command. Additionally doing
```bash
help {command}
```
will list helpful information about the CLI command.

e.g.
```bash
help send_command
```
Let's try viewing logs. 
Enter 
```bash
start_logging
```
then wait a few seconds and send 
```bash
print_logs
```
This should start printing logs from the board. Now, use 
```bash
Ctrl+C
```
to exit the polling mode entered by print_logs.

Now let's try sending our first mission command to the board. 

```bash
send_conn_request
```
It should be successful. Only one of these need to be sent per session.
Enter  
```bash
send_command --command CMD_PING
```
This should print a response including a SUCCESS! status.
Note that currently you can not send multiple send_conn_request to the board without resetting it (either using the reset button, or using the CMD_EXEC_OBC_RESET before using Ctrl+C). This means that if you close the CLI and open a new one, you won't be able to send_conn_request and thus you won't be able to use send_command without resetting the board.

:::tip
Before closing the CLI using Ctrl+C, it is useful to send_command CMD_EXEC_OBC_RESET first so that the board is reset and ready for another send_conn_request to be sent.
:::

---

## 8. Troubleshooting

If the CLI does not open:

- Try other `/dev/ttyUSB*` or `/dev/ttyACM*` devices.
- Verify the board is outputting logs using PuTTY on Windows.
- Re-attach the USB device with `usbipd attach`.
- Ask a lead for assistance if nothing works.

If the CLI opens but the ping command doesn't work:

- Try other `/dev/ttyUSB*` or `/dev/ttyACM*` devices.
- Press the PORRST button, then try doing send_conn_request and sending the ping command again in a new CLI instance
- Ask a lead for assistance if nothing works.

---

# First-Time Setup

## Install `usbipd`

If using WSL2, Windows does not automatically expose USB devices to WSL.

Install `usbipd`:

- Official installation guide: [https://learn.microsoft.com/en-us/windows/wsl/connect-usb#install-usbipd-on-wsl](Microsoft) 

---

## Verify `usbipd` is Running

1. Open **Services** on Windows.
2. Scroll alphabetically until you find:

```text
USBIP Device Host (or something similar)
```

3. Ensure the service is running.

---

## Initial USB Binding

> This only needs to be done once per USB device.

Open PowerShell as Administrator.

First, find the BUSID:

```powershell
usbipd list
```

Then bind the device:

```powershell
usbipd bind --busid 5-2
```

Replace `5-2` with your BUSID.

After binding once, future reconnects only require:

```powershell
usbipd attach --wsl --busid {YOUR-BUSID}
```
Now that usbipd is set up, go back and complete the steps.

---

# Additional Notes
- If you would like the port to be back on Windows (to use PuTTy, etc.) you can either do usbipd detach, or replug the USB connection to the board.
- This workflow replaces using PuTTY for UART logging. It also allows you to send commands to the board and see responses.
- The Ground Station CLI communicates directly over the forwarded USB serial port using UART.
- If you are using native Linux instead of WSL2, no `usbipd` setup is required.

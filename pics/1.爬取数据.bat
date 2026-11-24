timeout /t 3
@echo off
chcp 65001 >nul
python hz_metro.py --crawl --loop -w 1.5 --out download_data
pause

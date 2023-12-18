#!/bin/bash
#Created By: Tawfiq
#Modified By: 
#Description: pull source code,npm & pm2 dependency

ssh rdcd@10.11.200.32 << 'ENDSSH'
cd /home/rdcd/App/loan-client
git switch main
git pull origin main
npm install
npm run build
cd /home/rdcd/App/pm2-scripts
pm2 start pm2-loan-client.json
 
ENDSSH

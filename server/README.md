# vousphere

To start the containers, run the following commands in the `src` folder:

```bash
docker-compose -f docker-compose.yml -f docker-compose.override.yml -p vousphere up -d
```

To seed quartz tables, run the following commands in the `scripts` folder:

```bash
bash seed_db.sh
```

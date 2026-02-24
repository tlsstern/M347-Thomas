# KN05: Arbeit mit Speicher

## A) Bind mounts

### Beschreibung
In diesem Teil wurde ein Bind Mount verwendet, um ein lokales Verzeichnis (`KN05-A`) des Host-Systems in den Container zu mounten. Das Bash-Skript `script.sh` wurde auf dem Host bearbeitet, und die Änderungen waren sofort im Container sichtbar.

### Verwendete Befehle
```bash
# Container starten und lokales Verzeichnis als Bind Mount einhängen
docker run -it --rm --name m347-kn05a -v "C:\Projects\M347-Thomas\KN05\KN05-A:/scripts" ubuntu bash

# Das Skript innerhalb des Containers ausführen
bash /scripts/script.sh
```

### Screencast
Ein Screencast des beschriebenen Prozesses wurde erstellt und befindet sich in den Abgabeunterlagen. (Link/Video-Datei: `Videos/KN05-A(retake).mp4`)

---

## B) Volumes

### Beschreibung
In diesem Teil wurde ein **Named Volume** erstellt und von zwei separaten Containern gleichzeitig verwendet. Container 1 schrieb eine Nachricht in eine Datei innerhalb des Volumes, welche Container 2 lesen und beantworten konnte.

### Verwendete Befehle
```bash
# Erstellen des Named Volumes
docker volume create m347-kn05b-vol

# Starten des ersten Containers mit dem Volume
docker run -it --rm --name m347-kn05b-1 -v m347-kn05b-vol:/shared_data ubuntu bash

# Schreiben einer Nachricht (Container 1)
echo "Hello from Container 1!" >> /shared_data/message.txt

# Starten des zweiten Containers mit demselben Volume
docker run -it --rm --name m347-kn05b-2 -v m347-kn05b-vol:/shared_data ubuntu bash

# Lesen der Nachricht & Antwort schreiben (Container 2)
cat /shared_data/message.txt
echo "And hello from Container 2!" >> /shared_data/message.txt

# Lesen der finalen Datei (Container 1)
cat /shared_data/message.txt
```

### Screencast
Ein Screencast des beschriebenen Prozesses wurde erstellt und befindet sich in den Abgabeunterlagen. (Link/Video-Datei: `Videos/KN05-B.mp4`)

---

## C) Speicher mit docker compose

### Beschreibung
Eine `docker-compose.yaml` wurde konfiguriert, um zwei nginx-Container (m347-kn05c-1 und m347-kn05c-2) zu starten und die drei Speichertypen zu testen.
- **Named Volume (Long Syntax):** Im ersten Container unter `/shared_named`.
- **Named Volume (Short Syntax):** Im zweiten Container unter `/shared_named`.
- **Bind Mount:** Im ersten Container unter `/usr/share/nginx/html`.
- **tmpfs Mount:** Im ersten Container unter `/var/cache/nginx`.

### Verwendete Datei
- [docker-compose.yaml](KN05-C/docker-compose.yaml)

### Befehl zum Starten
```bash
docker compose up -d
```

### Ausgaben der mount Befehle

**Container 1 (m347-kn05c-1) - Alle 3 Speichertypen sichtbar:**
```text
/dev/sde on /shared_named type ext4 (rw,relatime)
tmpfs on /var/cache/nginx type tmpfs (rw,nosuid,nodev,noexec,relatime,mode=755)
C:\ on /usr/share/nginx/html type 9p (rw,noatime,aname=drvfs;path=C:\;uid=0;gid=0;metadata;symlinkroot=/mnt/host/,cache=5,access=client,msize=65536,trans=fd,rfd=5,wfd=5)
```

**Container 2 (m347-kn05c-2) - Nur Named Volume sichtbar:**
```text
/dev/sde on /shared_named type ext4 (rw,relatime)
```

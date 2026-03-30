# KN08 Kubernetes III - Microservices

In diesem Modul wurde eine Microservice-Architektur entworfen, containerisiert und in einem Kubernetes-Cluster orchestriert. Der Fokus lag auf der Interoperabilität zwischen verschiedenen Services, dem Management von Konfigurationen über Kubernetes-Objekte sowie der Durchführung von unterbrechungsfreien Updates.

## A) Microservice-Architektur

Die Applikation besteht aus fünf funktionalen Komponenten:

1.  **Frontend (UI)**: Eine React-basierte Weboberfläche zur Verwaltung von tbzCoins.
2.  **Account (DB-Gateway)**: Der zentrale Service für Kontostände und Freundeslisten. Nur dieser Service hat direkten Zugriff auf die MySQL-Datenbank.
3.  **BuySell**: Ermöglicht den Kauf und Verkauf von Kryptos durch Interaktion mit dem Account-Service.
4.  **SendReceive**: Ermöglicht den Transfer von Kryptos zwischen Freunden via Account-Service.
5.  **Datenbank (DB)**: Eine MySQL-Instanz zur persistenten Speicherung der Daten.

### Kommunikation
Die Services kommunizieren über **HTTP/REST**. Während das Frontend für den Benutzer die zentrale Anlaufstelle bietet, agiert der **Account Service** intern als Shared-Resource-Provider für die Transaktionslogik von `BuySell` und `SendReceive`.

---

## B) Realisierung & Umsetzung

### 1. Containerisierung (Multistage Dockerfiles)
Um die Image-Grösse zu minimieren und die Sicherheit zu erhöhen, wurden für die Applikation **Multistage Dockerfiles** eingesetzt:
- **Build-Stage**: Abhängigkeiten installieren und Applikation kompilieren (Node.js).
- **Run-Stage**: Nur die notwendigen Artefakte (z.B. der `build`-Folder oder die JS-Binaries) in ein schlankes Basis-Image (Alpine) kopieren.

Besonders beim **Frontend** wird die React-App währen dem Build-Prozess erstellt und schliesslich von einem **Nginx**-Webserver ausgeliefert.

### 2. Kubernetes Objekte
Die Bereitstellung erfolgte mittels standardisierter YAML-Manifeste:
- **Deployments**: Verwalten die Replicas der Pods (3 Replicas für das Frontend für Hochverfügbarkeit).
- **Services (LoadBalancer)**: Alle Services wurden als `type: LoadBalancer` konfiguriert, um eine einfache Erreichbarkeit (inkl. statischer NodePorts wie `30000` für das Frontend) zu garantieren.
- **ConfigMap & Secrets**: Zentrale Verwaltung von DB-Verbindungsdaten und API-URLs.
- **Environment Injection**: Das Frontend nutzt ein `env.sh` Script, um Kubernetes-ConfigMap Variablen zur Laufzeit in die statischen Files einzubetten.

### 3. Proof of Operation
Die folgende Abbildung zeigt die erfolgreich gestartete Infrastruktur im Kubernetes-Cluster:

![Kubernetes Ressourcen](images/k8s_resources.png)

*Hier ist ersichtlich, dass alle Pods (inkl. der 3 Frontend-Replicas) im Status `Running` sind und die Services korrekt zugeordnet wurden.*

---

## C) Erweiterte Features

### 1. Zero-Downtime Update (Rolling Update)
In Schritt 8 wurde ein Software-Update simuliert (Wechsel auf Frontend `v3`). Kubernetes führt hierbei ein **Rolling Update** durch:
1. Neue Pods werden mit dem neuen Image gestartet.
2. Erst wenn die neuen Pods "Ready" sind, werden die alten Pods terminiert.
3. Der Benutzer bemerkt keinerlei Unterbruch (Downtime).

Das Ergebnis des Updates ist in der Weboberfläche sichtbar:

![Frontend UI v3](images/frontend_ui.png)

### 2. Load Balancing
Durch die Definition von mehreren Replicas und einem Service vom Typ `LoadBalancer` verteilt Kubernetes die Last automatisch auf alle verfügbaren Pods. Dies erhöht die Fehlertoleranz der gesamten Microservice-Landschaft massiv.

---
*Die vollständigen Konfigurationsdateien befinden sich im Verzeichnis `crypto-app/k8s/`.*

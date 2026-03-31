# KN08 - Kubernetes Microservices

Kurze Übersicht für Programmierer: 5 Microservices auf AWS K8s (EKS/K3s) mit LoadBalancer und Rolling Updates.

## Deployment & Config
- **Technik**: Multistage Dockerfiles, Kubernetes Deployments, Services (LoadBalancer), ConfigMaps & Secrets.
- **YAMLs**: Die Konfigurationen befinden sich unter `crypto-app/k8s/`.
- **Frontend-Fix**: Start-Script (`env.sh`) injiziert K8s-Variablen zur Runtime in die statischen Files.

## Architektur & Business Logic
- **Frontend**: React UI.
- **Account**: Einziger Service mit DB-Zugriff (MySQL).
- **BuySell / SendReceive**: Logik-Services, die mit dem Account-Service kommunizieren.
- **Währung**: `tbzCoin` (15 CHF / keine Dezimalstellen).

## Verification
![Kubernetes Ressourcen](images/k8s_resources.png)
![Frontend UI v4](images/frontend_ui.png)

## URL
Live-App: [http://54.175.15.144](http://54.175.15.144)
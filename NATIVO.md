# Recursos nativos do King Maple (estado honesto)

A camada de integracao nativa vive em `src/lib/native/` e usa plugins Capacitor
no APK. No navegador, cada recurso tem um equivalente web ou informa a limitacao.

## Implementado de verdade (nativo no APK)
| Recurso | Implementacao |
|---|---|
| Importar arquivos do dispositivo | Seletor oficial (SAF) via @capawesome/capacitor-file-picker; copia para armazenamento privado do app (@capacitor/filesystem) |
| Abrir arquivos com apps instalados | Intent ACTION_VIEW + FileProvider (plugin proprio KingNative) |
| Compartilhar arquivos/links | @capacitor/share (mechanismo oficial) |
| Instalar APKs | Instalador oficial do Android via KingNative.installApk (FileProvider + ACTION_VIEW); exige autorizacao do usuario |
| Bateria real na barra de tarefas | KingNative.battery (BatteryManager) |
| Conexao real (wifi/dados) | @capacitor/network |
| Abrir ajustes do sistema (rede, bluetooth, bateria, apps) | KingNative.openSettings (telas oficiais) |
| Links externos no navegador do aparelho | @capacitor/app openUrl (intent) |
| Papel de parede com imagem do aparelho | Galeria + @capacitor/filesystem, persistente |
| Player de musica com arquivos reais | Importacao nativa + reproducao dos arquivos do usuario (audio do WebView) |
| Notas, calendario, arquivos virtuais | localStorage (persistente, offline) |

## Ainda NAO implementado (sem simulacao)
- Reproducao via Media3/ExoPlayer e controles de tela de bloqueio (usa o audio do WebView).
- Captura de capa do album (ID3).
- Downloads do WebView via DownloadManager (listener nativo de download).
- Notificacoes locais (@capacitor/local-notifications) - nao incluido neste ciclo.
- Papel de parede global do Android (intencional; so o do desktop King Maple).
- Desligar/reiniciar o aparelho (impossivel para apps comuns).

## Reaplicacao automatica
O projeto Android e recriado a cada build; o plugin KingNative (Java), o
MainActivity, o FileProvider e o AndroidManifest sao reinjetados pelo proprio
workflow (`.github/workflows/node.js.yml`), junto com a assinatura permanente.

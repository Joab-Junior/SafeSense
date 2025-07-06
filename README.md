# SafeSense

**SafeSense**: Sistema de detecção de vazamento de gás inflamável, com um dispositivo físico integrado a um aplicativo mobile.

---

## Estrutura de Arquivos

- `/front-end/SafeSense-app`: Pasta destinada ao desenvolvimento do aplicativo mobile usando o **Ionic Framework**.
  - **Atualmente**: Com o front e o design parcialmente completo.
  - Futuro: Código-fonte do aplicativo e recursos relacionados.

- `/back-end/SafeSenseAPIManager`: API desenvolvida em **PHP** com suporte a autenticação via JWT.
  - Registro e login de usuários funcionais.
  - Estrutura modularizada por segurança e organização.

- `/docs`: Documentação técnica (A SER CRIADO).
  - **manual_de_usuario.pdf**: Guia para usuários finais.
  - **manual_tecnico.pdf**: Especificações técnicas.

---

## Tecnologias Utilizadas

### Dispositivo Físico
- **Sensor**: MQ-4 para detecção de gases inflamáveis.
- **Microcontrolador**: ESP32 com Wi-Fi integrado.
- **Fonte de Alimentação**: Bateria recarregável de 5V.

### Aplicativo Mobile
- **Framework**: Ionic Framework + Angular.
- **Estado Atual**: Design, front-end, back-end avançados.
- **Funcionalidades Implementadas**:
  - Tela de login com validação visual e feedback em tempo real.
  - Validação forte de senha com mensagens específicas.
  - Toasts de resposta e tela de carregamento (loading).

- **Funcionalidades Futuras**:
  - Configuração do dispositivo via internet, utilizando protocolos IoT.
  - Monitoramento e controle remoto, acessível de qualquer lugar.

---

## Roadmap

- [ ] Finalizar estrutura inicial do aplicativo (backend e frontend).
- [x] Realizar integração dispositivo-aplicativo.
- [x] Adicionar notificações em tempo real.
- [x] Exibir histórico de vazamentos no app.

---

## Licença

Direitos reservados à equipe do SafeSense.

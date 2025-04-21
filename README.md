# SafeSense

**SafeSense**: Sistema de detecção de vazamento de gás inflamável para inicialmente, uso doméstico, com um dispositivo físico integrado a um aplicativo mobile. Este repositório é privado e destina-se ao desenvolvimento colaborativo do projeto.

---

## Estrutura de Arquivos


- `/Project-SafeSense`: Pasta destinada ao desenvolvimento do aplicativo mobile usando o **Ionic Framework**.
  - **Atualmente**: Contém apenas a estrutura inicial do projeto.
  - Futuro: Código-fonte do aplicativo e recursos relacionados.

- `/docs`: Documentação técnica (A SER CRIADO).
  - **manual_de_usuario.pdf**: Guia para usuários finais.
  - **manual_tecnico.pdf**: Especificações técnicas.

---

## Tecnologias Utilizadas

### Dispositivo Físico
- **Sensor**: MQ-2 para detecção de gases inflamáveis.
- **Microcontrolador**: ESP32 com Wi-Fi integrado.
- **Fonte de Alimentação**: Bateria recarregável de 5V.
- **Conectividade**: Integração com serviços na nuvem para suporte a IoT e acessibilidade global.

### Aplicativo Mobile
- **Framework**: Ionic Framework.
- **Estado Atual**: Projeto inicial criado, desenvolvimento a ser iniciado.
- **Funcionalidades Planejadas**:
  - Configuração do dispositivo via internet, utilizando protocolos IoT.
  - Recebimento de alertas em tempo real.
  - Histórico de detecções.
  - Monitoramento e controle remoto, acessível de qualquer lugar.

---

# Como Clonar o Repositório

Siga os passos abaixo para clonar o repositório do projeto SafeSense em sua máquina local:

1. **Confirme o acesso ao repositório**
   - Certifique-se de que possui permissões para acessar o repositório no GitHub. Se for privado, verifique sua autenticação.

2. **Execute o comando para clonar**
   - No terminal ou prompt de comando, digite o seguinte:
     ```bash
     git clone https://github.com/seu-usuario/safesense.git
     ```

3. **Acesse a pasta do projeto**
   - Navegue para a pasta do repositório recém-clonado:
     ```bash
     cd Project-SafeSense
     ```

4. **Tudo pronto!**
   - O repositório está agora na sua máquina local, pronto para desenvolvimento.

---

## Como Contribuir

Este projeto é colaborativo e depende das contribuições de cada membro da equipe para evoluir. Siga estas diretrizes para garantir um fluxo de trabalho organizado e produtivo:

1. **Tenha o ambiente configurado**: Certifique-se de que as dependências principais estão instaladas, como Node.js, Ionic CLI e qualquer outra ferramenta que você usará com frequência no projeto.

2. **Trabalhe com branches específicas**: Sempre crie uma branch separada para o recurso ou correção em que está trabalhando. Nomeie a branch de forma descritiva (por exemplo, `feature/configuracao-bluetooth` ou `bugfix/ajuste-notificacoes`).

3. **Documente suas alterações**: Ao concluir o desenvolvimento, comente no código e descreva suas mudanças no commit para que outros membros da equipe entendam o que foi feito.

4. **Garanta a consistência**: Antes de enviar uma contribuição, revise o código para seguir os padrões estabelecidos pela equipe. Utilize linters e ferramentas de formatação para manter a qualidade do código.

5. **Faça o merge com cuidado**: Ao enviar um pull request, explique por que sua alteração é necessária e inclua exemplos práticos ou prints, se possível. Aguarde a aprovação antes de realizar o merge.

6. **Colabore ativamente**: Revise os pull requests de outros membros da equipe, compartilhe feedback e sugira melhorias. Comunicação é essencial para o sucesso do projeto.

---

## Roadmap
- [ ] Finalizar estrutura inicial do aplicativo (backend e frontend).
- [ ] Implementar integração IoT com serviços na nuvem.
- [ ] Realizar integração dispositivo-aplicativo.

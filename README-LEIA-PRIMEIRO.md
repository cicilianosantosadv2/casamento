# DANIELA & ANDERSON — KIT CLAUDE CODE + REMOTION

## O que este ZIP contém
Um projeto Remotion editável (1920×1080 / 30 FPS) com abertura, montagem fotográfica, zoom/pan discreto, transições crossfade, encerramento, sistema de narração em duas vozes e mixagem básica de trilha com redução automática durante as falas.

Também contém os **votos de Anderson efetivamente recebidos**, o DOCX original preservado, comandos para importar as fotos do Windows sem alterar a origem, testes A/B de voz, verificação de duplicatas SHA-256, folha de contatos, validação de duração e um `CLAUDE.md` com o plano de execução para o Claude Code.

**Inclui UMA fotografia real autorizada como referência para a abertura e o mockup aprovado. Não contém as demais 178 fotos, trilha ou votos de Daniela.** Esses arquivos residem no seu computador ou ainda não foram fornecidos. Nenhum vídeo final nem MP3 de narração foi gerado nesta preparação.

## 1. Abra o projeto no Windows

1. Extraia a pasta `Kit_Claude_Code_Casamento_Daniela_Anderson` em um diretório com espaço livre suficiente (idealmente SSD).
2. Dentro da pasta, execute **`INICIAR_AQUI.cmd`** com duplo clique. Ele instala as dependências npm e, se os caminhos existirem, copia as fotos para o diretório do projeto, identifica arquivos iguais e prepara o manifesto. Pode solicitar instalação adicional do Python.
3. Execute `02-EXECUTAR-CLAUDE-CODE.cmd` para iniciar o Claude Code já com a tarefa inicial. Alternativamente, entre na pasta pelo terminal e execute `claude`, utilizando `COMANDO-PARA-CLAUDE-CODE.txt`. O agente lerá `CLAUDE.md` e `DIRECAO-DE-ARTE.md`.
4. O Claude Code deverá primeiro verificar a importação, a linha do tempo e produzir testes de voz e uma prévia curta. **Não comece renderizando o filme inteiro.**

### Design aprovado
A imagem de referência aprovada está em `referencias/layout-streaming-aprovado.png`; a imagem REAL que a inspira está em `public/referencia/cerimonia-original.jpg`. A abertura animada de 12 segundos já consta em `src/components/Opening.tsx`. Ler também `DIRECAO-DE-ARTE.md`. Não é um site Netflix, é um filme MP4 com abertura inspirada em produções de streaming.

### Caminhos informados
```
Fotos: C:\Users\Windows\Pictures\Casamento\Casamento Dani e Anderson
Votos Anderson: C:\Users\Windows\Documents\VOTOS - ANDERSON.docx
Votos Daniela (futuro): cole o texto em roteiro\votos-daniela.txt
```

Se a pasta das fotos tiver outro nome, importe manualmente:
```powershell
npm run fotos -- "C:\CAMINHO\CORRETO\PARA\AS_FOTOS"
```

**Atenção:** a pasta de fotos em `public/fotos` é uma cópia de trabalho. A pasta original do Windows não é alterada. A ordem de edição é inferida inicialmente pelo nome dos arquivos, e **precisa ser aprovada visualmente**.

## 2. Validação dos originais
```powershell
npm run auditar
python scripts/validar-votos.py
python scripts/folha-de-contato.py
```
Abra os JPEGs de `out/folhas-de-contato/` e marque o que precisa ser reordenado. O importador agrupa arquivos com SHA-256 idênticos; identificamos uma duplicação exata no Drive original (`3I1A1386.jpg`). Se o resultado local não for 178 imagens únicas, interrompa a montagem e investigue.

## 3. Narração gratuita em português brasileiro
Requisitos: Python 3.11+ (ou compatível), conexão com a Internet para Edge TTS.
```powershell
python -m pip install -r requirements.txt
python scripts/gerar-vozes.py --testes
```
Arquivos gerados em `public/audio/testes`: 3 opções para Daniela e 3 para Anderson.

**Preset inicial**
- Daniela: `pt-BR-FranciscaNeural`, velocidade `-6%`, tom `-2Hz`.
- Anderson: `pt-BR-AntonioNeural`, velocidade `-8%`, tom `-5Hz`.

Ouça os testes sem música. Se a articulação estiver boa, gere **apenas** a voz de Anderson agora:
```powershell
python scripts/gerar-vozes.py --pessoa anderson
npm run timeline
```

A execução envia o texto ao serviço online utilizado pelo Edge TTS; se isso não for aceitável, solicite ao Claude Code implementar o **Kokoro-82M offline** no mesmo contrato de arquivos MP3 + manifestos JSON. O kit não finge que vozes sintéticas são gravações dos próprios noivos.

### Quando os votos de Daniela estiverem prontos
1. Abra `roteiro/votos-daniela.txt` e cole o texto real, sem acrescentar exemplos.
2. Revise a entonação com a voz já aprovada.
3. Execute `python scripts/gerar-vozes.py --pessoa daniela`.
4. Rode `npm run timeline` e confira o alerta de duração e os ajustes necessários.

No filme a ordem inicial é **Daniela, depois Anderson**, mas o Claude Code pode reordenar com sua aprovação.

### Atenção ao texto de Anderson
Foi transcrito fielmente do DOCX, **sem o título documental** `Votos — Anderson para Daniela`. A subseção final `As três coisas que quero levar conosco` está no texto da fala. Decida com o Claude Code se esse subtítulo será lido em voz alta; não removê-lo silenciosamente.

## 4. Trilha sonora
Coloque um MP3 licenciado em `public/audio/trilha.mp3` e registre autor, URL e licença em `roteiro/licenca-trilha.txt`. Nenhuma música foi incluída por falta de escolha/autorização. A mixagem diminuirá o volume durante a narração, mas ainda requer inspeção de áudio.

## 5. Abrir, pré-visualizar e renderizar
```powershell
npm run timeline
npm run studio
npm run preview
```
Para prévia SOMENTE da abertura, mesmo antes das 178 fotos: `npm run preview:abertura`.
`npm run preview` renderiza apenas os primeiros 30 segundos da composição em `out/previa_30s.mp4` (depois de importar as fotos). Para o filme definitivo:
```powershell
npm run check
npm run render
```
`npm run render` **bloqueia** exportação final se faltar qualquer um destes itens: 178 fotos únicas, votos e áudios atualizados das duas pessoas, trilha, ficha de licença preenchida e as aprovações explícitas em `roteiro/aprovacoes.json`. Também bloqueia se a narração ultrapassar a faixa de duração configurada para o conjunto de fotografias. A correção deve ser uma decisão artística explícita, **nunca um corte automático de votos**.

A abertura cinematográfica de 12 segundos utiliza a fotografia real do brinde e miniaturas de fotos verdadeiras, que aparecem depois de importar as imagens. A versão inicial utiliza aproximadamente 3,43 segundos de exposição por foto e transições sobrepostas de 0,2 segundo. Isso é editável em `scripts/lib.mjs` e `scripts/montar-timeline.mjs`, desde que a duração exibida na timeline continue matematicamente correta. As fotos verticais recebem preenchimento suave ao fundo sem distorcer o conteúdo.

## 6. Como melhorar a excelência artística
- Transforme a folha de contato em storyboard: preparativos, cerimônia, detalhes, olhares, emoção, convidados e celebração. A classificação só poderá ser feita vendo as fotos.
- Escolha as melhores fotos para a abertura e o encerramento, sem confiar apenas na numeração.
- Distribua transições e mudanças de escala com parcimônia. Evite efeitos chamativos durante o texto das promessas.
- Faça mixagem crítica em fones e caixas de som: priorize inteligibilidade das vozes, controle picos e fade musical natural.
- Inspecione o vídeo inteiro, não somente a prévia. Revise fotos verticais, rostos próximos às margens e eventuais clipes repetidos.

## 7. MOTION4 e GSAP
O arquivo `referencias/Motion Graphics - MOTION4.pdf` é uma coleção de prompts HTML + GSAP para vinhetas curtas, **não** uma substituição de Remotion. O pacote `@remotion/gsap` pode ser acrescentado posteriormente se o Claude Code identificar utilidade específica em uma abertura mais elaborada e mantiver a animação frame-accurate. Por enquanto, a solução usa o próprio Remotion.

## 8. Instalação independente
O kit instala sua própria versão compatível do Remotion (`4.0.539`) e componentes associados **dentro desta pasta**. Não substitui nem desinstala projetos Remotion existentes em outras pastas da sua máquina.

## 9. Licenciamento e privacidade
Este é um projeto pessoal de casamento. Não utilize logo Netflix, áudio 'Tudum' ou gravação musical não autorizada. O Edge TTS utiliza um serviço online; as fotos não precisam sair do seu computador durante a renderização local. Não suba imagens privadas para repositórios públicos.

## Fontes técnicas
- https://www.remotion.dev/docs/transitioning
- https://www.remotion.dev/docs/media/audio
- https://www.remotion.dev/docs/gsap
- https://www.remotion.dev/docs/cli/render
- https://github.com/rany2/edge-tts

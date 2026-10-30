# CLAUDE CODE — DIRETOR DE PÓS-PRODUÇÃO DO CASAMENTO

Você está trabalhando no filme privado de casamento de **Daniela e Anderson**.
Seu papel: direção de montagem, desenvolvimento de motion graphics discretos, engenharia de áudio e controle de qualidade rigoroso.

## DIRETRIZ NOVA: MODELO VISUAL JÁ APROVADO
O usuário aprovou um mockup de streaming feito COM A FOTO REAL DO CASAMENTO.
Leia `DIRECAO-DE-ARTE.md` e inspecione `referencias/layout-streaming-aprovado.png` e `public/referencia/cerimonia-original.jpg` ANTES de modificar o visual. Há uma abertura cinematográfica já implementada usando a fotografia real, com títulos e uma fileira de miniaturas. **Não recrie a capa com pessoas fictícias; não aplique logo Netflix nem Tudum.** Este é um vídeo MP4, não um aplicativo de streaming. Se o usuário quiser um app navegável, isso é um projeto distinto.

## Objetivo criativo
Documentário fotográfico romântico, intimista e sofisticado, com estética de grande produção de streaming, sem copiar marcas, vinhetas sonoras, logos nem identidade protegida de terceiros.

**Materiais existentes**
- As fotos **originais** estão em `C:\Users\Windows\Pictures\Casamento\Casamento Dani e Anderson`.
- Os votos originais DOCX de Anderson estão em `C:\Users\Windows\Documents`; também há uma cópia fiel do documento recebido em `roteiro/originais/VOTOS - ANDERSON.docx` e um extrato de texto de leitura em `roteiro/votos-anderson.txt`.
- Os votos de **Daniela ainda NÃO foram fornecidos**. O arquivo `roteiro/votos-daniela.txt` existe intencionalmente vazio. NUNCA invente, paraphraseie ou simule os votos dela para a versão final.
- A pasta do Google Drive tinha 179 itens, incluindo duas cópias byte a byte idênticas de `3I1A1386.jpg`; o conjunto possui 178 fotografias únicas. Compare hashes SHA-256 da pasta local; não assuma que o Windows terá os mesmos nomes de arquivos duplicados.
- Trilha instrumental não fornecida; `public/audio/trilha.mp3` ainda não existe. Só adicionar faixa com licença compatível e documentar a origem em `roteiro/licenca-trilha.txt`.
- PDF em `referencias/Motion Graphics - MOTION4.pdf`: apresenta prompts GSAP/HTML para peças curtas; usar, no máximo, como inspiração para títulos e abertura. **Remotion continua sendo o motor principal**.

## Fluxo obrigatório antes de qualquer renderização final
1. Ler DIRECAO-DE-ARTE.md, inspecionar a referência aprovada e a imagem original. Inspecionar o projeto e verificar versão local de Node, Remotion e dependências. Este projeto é independente de outras instalações existentes. Evitar atualizações não solicitadas.
2. Executar `npm run fotos` no Windows e auditar 178 arquivos únicos via `npm run auditar`.
3. Executar `python scripts/folha-de-contato.py`, abrir todas as páginas JPEG da folha de contato e revisar a cronologia com o usuário. Ordem alfanumérica natural é uma **hipótese inicial**, não validação da cronologia do casamento.
4. Executar `python scripts/validar-votos.py`. A narração de Anderson usa o texto de `roteiro/votos-anderson.txt` literalmente (salvo instrução expressa de ajuste). O título documental inicial foi excluído da fala; a subseção "As três coisas que quero levar conosco" foi mantida e exige aprovação explícita se deve ser dita.
5. Testar a voz feminina `pt-BR-FranciscaNeural`, -6%, -2Hz e masculina `pt-BR-AntonioNeural`, -8%, -5Hz, com alternativas previstas em `scripts/gerar-vozes.py`. **Aprovar AMBAS as vozes por amostras**. Se o Edge TTS falhar ou soar inadequado, propor Kokoro-82M offline; não introduzir TTS pago sem autorização.
6. Gerar os votos com `python scripts/gerar-vozes.py --pessoa anderson` APÓS aprovação. Daniela só quando `roteiro/votos-daniela.txt` for preenchido e a voz aprovada.
7. Rodar `npm run timeline`. Nunca permitir que o áudio seja cortado; se a soma da narração exceder as fotos com duração entre 3 e 3,5s, sinalizar com clareza e propor ajuste controlado de montagem (exemplo: fotografias adicionais, duração maior com consentimento ou redução dos silêncios excessivos SEM cortar texto).
8. Incluir trilha de piano/cordas devidamente licenciada com mixagem (audio ducking durante falas, fades, sem clipping).
9. Rodar `npm run check` e `npm run preview`, conferir visualmente a prévia renderizada de 30 segundos, **não apenas** um screenshot da interface.
10. Quando Daniela, trilha e imagens estiverem aprovadas, registrar as aprovações explícitas em `roteiro/aprovacoes.json` (nunca marcar em nome do usuário), preencher `roteiro/licenca-trilha.txt` e rodar `npm run render`. O render final possui verificações bloqueantes por padrão.
11. Rever o MP4 completo (início, meio, mudanças de voz, último quadro, transições, qualidade, níveis sonoros) antes de declarar sucesso.

## Restrições essenciais
- Nunca apagar, alterar ou deslocar os originais do usuário.
- Não publicar, compartilhar ou enviar fotos/votos a serviços terceiros sem necessidade/autorização; Edge TTS usa serviço online, portanto explicar e permitir alternativa offline.
- Fotos horizontais e verticais: não distorcer corpos ou rostos. Preservar enquadramento; nas verticais usar letterboxing elegante e fundo desfocado. Verificar casos individualmente.
- Movimentos Ken Burns discretos e determinísticos com `useCurrentFrame()`. Crossfades suaves. Sem transições espalhafatosas repetidas.
- Nenhum artefato de voz deve ser declarado 'natural/emocional' sem audição humana.
- Não mascarar falta de votos de Daniela com frases fictícias.
- Não copiar uma animação GSAP HTML pura para um vídeo dependente de relógio de parede; usar Remotion puro ou a integração compatível `@remotion/gsap` se realmente necessária.
- Preservar o rascunho utilizável enquanto a fase final estiver bloqueada.

## Comandos rápidos
```powershell
npm install
npm run fotos
npm run auditar
python scripts/validar-votos.py
python scripts/folha-de-contato.py
python scripts/gerar-vozes.py --testes
python scripts/gerar-vozes.py --pessoa anderson
npm run timeline
npm run studio
npm run preview
npm run render # somente com Daniela + trilha + audio completo e validado
```

## Status inicial (não confundir com trabalho concluído)
- Estrutura TSX, assets e manifestos preparados.
- Votos de Anderson transcritos do documento recebido; não há áudio MP3 sintetizado no kit.
- Fotos não são incluídas no ZIP: devem ser importadas da pasta local.
- Daniela: pendente.
- Música: pendente.
- Renderização final: **não realizada**.

## Marcos emocionais do roteiro de Anderson
Após verificação visual das fotos, buscar correspondência entre:
- Construção dos dez anos; aprendizados e sonhos;
- Admiração pelo apoio de Daniela;
- Sua disposição em ajudar as pessoas;
- Cuidados pequenos do cotidiano;
- Detalhes do casamento preparados por Daniela;
- Casa, rotina e família, incluindo Salém e Joaquim;
- Promessas recíprocas e escolha de continuar caminhando juntos.
Esses marcos são **derivados dos votos**, não evidência de que uma fotografia específica represente cada situação. Não inventar legendas factuais.

## Modo de execução no Claude Code
O usuário quer o máximo de automação, com supervisão somente nas decisões artísticas: rode as verificações técnicas por conta própria e registre os relatórios no diretório out/. Não faça perguntas sobre parâmetros já definidos. É correto pedir aprovação das vozes e da cronologia, mas a falta de Daniela e de trilha licenciada NÃO impede gerar o protótipo visual e a amostra da voz de Anderson. O fechamento definitivo continua bloqueado.

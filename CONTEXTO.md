# Sem Censura — Contexto do Projeto

## Visão geral
Site expositivo de loja de lingerie e moda praia chamada **Sem Censura**.
Desenvolvido como protótipo funcional em HTML/CSS/JS puro, pronto para ser convertido em aplicação real.

**Slogan:** "Sem Censura assim como você"

---

## Informações da Loja

### Contato
- **WhatsApp:** +55 (88) 9913-8091
- **Instagram:** [@ljsemcensura](https://www.instagram.com/ljsemcensura)

### Endereço
Rua Major José Francisco, 303 — Loja 8 e 10 — Centro, Mauriti - CE, 63210-000

### Horário de Funcionamento
| Dia | Horário |
|---|---|
| Segunda | 07:30 – 17:30 |
| Terça | 07:30 – 17:30 |
| Quarta | 07:30 – 17:30 |
| Quinta | 07:30 – 17:30 |
| Sexta | 07:30 – 17:30 |
| Sábado | 07:30 – 15:00 |
| Domingo | Fechado |

---

## Decisões de produto

### Funcionalidades da vitrine (cliente)
- Galeria de produtos com filtros: Todos / Lingerie / Moda Praia / Novidades / Em estoque
- Card de produto com: nome, código de barras/referência, preço, cores disponíveis (bolinhas coloridas), badges (Novo / Praia / Esgotado)
- Modal de produto com:
  - Seletor de tamanho (botões com fundo `#f0e8e2`, selecionado em vinho `#6b1428`)
  - Seletor de cor (círculos clicáveis com borda vinho ao selecionar)
  - Preview em tempo real da mensagem que será enviada ao WhatsApp
  - Botão verde "Enviar mensagem no WhatsApp" que abre wa.me com mensagem pré-formatada
  - Botão "Reservar peça" que abre formulário de reserva
- Mensagem WhatsApp gerada automaticamente no formato:
  ```
  Olá! Estou interessada(o) nessa peça:
  👗 *[Nome da peça]*
  📏 Tamanho: [tamanho selecionado]
  🎨 Cor: [cor selecionada]
  🏷️ Referência: [código]
  Poderia me dar mais informações?
  ```
- Formulário de reserva: nome completo + telefone + tamanho → registra no painel admin
- **Botão flutuante do WhatsApp** no canto inferior direito com animação de pulso

### Sistema de Login / Cadastro de Cliente
- Botão "Entrar" no nav abre modal com duas abas: **Entrar** e **Criar Conta**
- **Entrar:** e-mail + senha → verifica cliente ou admin
- **Criar Conta:** nome completo + e-mail + telefone + senha + confirmação de senha
- Se as credenciais de admin forem inseridas, redireciona para o painel de administração
- Se for cliente, exibe perfil com dados e opção de sair
- Credenciais de admin (placeholder — trocar antes de publicar):
  - Usuário: `admin`
  - Senha: `admin123`

### Funcionalidades do painel admin
Acessado somente após login com credenciais de admin.

- **Dashboard**: métricas (total de peças, unidades em estoque, reservas, clientes cadastrados) + tabela geral
- **Cadastrar peça**: nome, código de barras, categoria, preço, quantidade, tamanhos (checkboxes), cores (tags clicáveis), flag novidade
- **Estoque**: edição direta de quantidade por produto com botão salvar por linha
- **Reservas**: lista de reservas com status (Pendente / Confirmada) e botão confirmar
- **Clientes**: tabela com todos os clientes cadastrados (nome, e-mail, telefone, data de cadastro)

### Footer
- Informações da loja: nome, slogan, descrição
- Links para Instagram e WhatsApp
- Endereço com link para Google Maps
- Horários de funcionamento
- Copyright

---

## Identidade visual

### Paleta de cores
```
--vinho:       #6b1428   (cor principal, botões primários, seleções)
--vinho-dark:  #4a0d1b   (nav, hover escuro)
--vinho-mid:   #8b2038   (hover intermediário)
--vinho-light: #b8516a   (bordas hover, detalhes)
--creme:       #faf6f3   (fundo geral)
--creme-dark:  #f0e8e2   (fundo botões tamanho não selecionados)
--offwhite:    #fdf9f7   (fundo modal)
--gold:        #c9a96e   (destaques, eyebrow texts)
--gold-light:  #e8d4a8   (textos claros sobre fundo vinho)
--text:        #1a0a0e
--text-muted:  #6b3a46
--text-light:  #9a6070
--whatsapp:    #25d366
```

### Tipografia
- **Títulos/display**: Playfair Display (serif, itálico) — Google Fonts
- **Corpo/UI**: DM Sans (sans-serif) — Google Fonts

### Tom de voz
Ousado, direto, sensual. Sem eufemismos. Slogan:
- "Sem Censura assim como você"

### Logo
- Texto "Sem" em DM Sans 300, letra-spacing 4px, cor gold-light, uppercase
- Texto "Censura" em Playfair Display itálico, 20px, branco
- Fundo nav: vinho-dark (#4a0d1b)

---

## Estrutura de dados (atualmente em memória — migrar para banco)

### Produto
```json
{
  "id": 1,
  "nome": "Body Rendado Noir",
  "cod": "LNG-001",
  "cat": "lingerie",
  "preco": "R$ 189,90",
  "emoji": "👙",
  "estoque": 12,
  "cores": [
    { "nome": "Vinho", "hex": "#6b1428" },
    { "nome": "Preto", "hex": "#1a0a0e" }
  ],
  "tamanhos": ["P", "M", "G", "GG"],
  "novidade": true
}
```

### Cliente
```json
{
  "id": 1,
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "tel": "(88) 99999-0000",
  "senha": "hash_aqui",
  "data": "26/05/2025"
}
```

### Reserva
```json
{
  "nome": "Ana Paula",
  "tel": "(88) 99999-1234",
  "produto": "Body Rendado Noir",
  "cod": "LNG-001",
  "tam": "M",
  "status": "pendente",
  "data": "23/05/2025"
}
```

---

## O que falta implementar (próximos passos)

1. **Backend / banco de dados** — Supabase ou Firebase para persistir produtos, clientes e reservas
2. **Autenticação real** — hash de senhas, sessões seguras, recuperação de senha
3. **Upload de imagens** — substituir emojis por fotos reais dos produtos
4. **Credenciais admin reais** — trocar `admin` / `admin123` por credenciais seguras
5. **Notificação de reserva** — enviar alerta para a loja quando uma reserva for criada (ex: via WhatsApp Business API ou email)
6. **Código de barras real** — integrar leitor de câmera no cadastro para capturar o código
7. **Filtro por faixa de preço**
8. **Página de produto individual** (URL própria para compartilhar)
9. **Logo da loja** — substituir logo texto por imagem real

---

## Stack atual
- HTML5 + CSS3 + JS vanilla (zero dependências)
- Google Fonts (Playfair Display + DM Sans)
- Tudo em arquivo único `index.html`
- Design responsivo (breakpoints: 768px e 480px)
- Compatível com qualquer hospedagem estática (Vercel, Netlify, Firebase Hosting)

## Intenção futura
- Migrar para React ou Next.js
- Usar Antigravity para orquestrar agentes que automatizem: gestão de estoque, notificações de reserva, atualização de catálogo

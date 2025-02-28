# CZ AI Agent - Crypto Influencer Replication (MVP)

## Overview
This project implements an MVP (Minimum Viable Product) AI agent that aims to replicate Changpeng Zhao (CZ), the founder and former CEO of Binance. The current implementation focuses on Twitter/X integration with plans for Instagram expansion.

## Why CZ?
- **Industry Leadership**: As Binance's founder, CZ has been a pivotal figure in cryptocurrency adoption and industry development
- **Distinct Communication Style**: Known for clear, direct communication and balanced market perspectives
- **Global Influence**: Significant impact on crypto market sentiment and industry trends
- **Technical Background**: Combines technical knowledge with business acumen

## Information Feed Strategy

### 1. Core Knowledge Base
- Historical tweets and public statements
- Conference presentations and interviews
- Blog posts and articles
- Public correspondence and AMAs
- Regulatory filings and official documents

### 2. Real-time Data Sources
- Market data and trends
- Industry news and developments
- Regulatory updates
- Community discussions
- Competitor analysis

### 3. Information Vetting Process
- Cross-reference multiple sources
- Verify through official channels
- Check source credibility
- Monitor community feedback
- Validate technical accuracy

## Technical Implementation (Current MVP Status)

### Implemented Features
- Basic Twitter stream monitoring
- Initial personality configuration
- Database schema and migrations
- Response generation framework
- Development environment setup

### In Development
- Market analysis integration
- Content generation refinement
- Testing framework
- Performance optimization

### Planned Features
- Instagram integration
- Advanced sentiment analysis
- Multi-language support
- Real-time market data integration

### Stack
- **Backend**: Node.js with TypeScript
- **Database**: Turso (SQLite)
- **AI Integration**: 
  - OpenAI GPT-4
  - Perplexity
  - Anthropic (optional)
- **APIs**: Twitter API v2
- **Job Processing**: Inngest
- **Monitoring**: Discord integration

## Current Limitations
- Content generation requires further refinement
- Market analysis is in early stages
- Testing coverage is limited
- Instagram integration not yet implemented
- Performance optimization needed

## Development Status
- [x] Basic infrastructure setup
- [x] Initial Twitter integration
- [x] Basic personality configuration
- [x] Response generation framework
- [ ] Content generation refinement
- [ ] Market analysis integration
- [ ] Testing framework
- [ ] Instagram integration
- [ ] Performance optimization
- [ ] Advanced sentiment analysis
- [ ] Multi-language support

## Setup

1. Clone the repository
```bash
git clone https://github.com/humanperzeus/cb1.git
cd cb1
```

2. Install dependencies
```bash
pnpm install
```

3. Configure environment
```bash
cp .env.example .env
# Fill in your API keys and configuration
```

4. Initialize database
```bash
cd database
pnpm run migrate
pnpm run init
```

5. Start the agent
```bash
cd agent
pnpm run dev:agent
```

## Architecture

```mermaid
graph TD
    A[Twitter Stream] --> B[Ingest Service]
    B --> C[Processing Queue]
    C --> D[AI Analysis]
    D --> E[Content Generation]
    E --> F[Response Queue]
    F --> G[Twitter API]
    H[Market Data] --> D
    I[News Feed] --> D
    J[Knowledge Base] --> D
```

## Personality Configuration
The agent's personality is configured through a set of parameters stored in the database:

- **Voice Characteristics**: Direct, professional, technically accurate
- **Content Style**: Informative, balanced, forward-looking
- **Engagement Rules**: Community-focused, solution-oriented
- **Market Analysis**: Data-driven, trend-aware
- **Risk Management**: Security-conscious, compliance-aware

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 
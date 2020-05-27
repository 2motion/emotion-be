<p align="center">
  순간의 감정을 기록하고, 공유하세요.
</p>

<p align="center">
  <a href="https://circleci.com/gh/2motion/emotion-be">
    <img src="https://circleci.com/gh/2motion/emotion-be.svg?style=svg" alt="Build status"/>
  </a>
  <a href="https://www.codefactor.io/repository/github/2motion/emotion-be"><img src="https://www.codefactor.io/repository/github/2motion/emotion-be/badge" alt="CodeFactor" /></a>
  <a href='https://coveralls.io/github/2motion/emotion-be?branch=master'>
    <img src='https://coveralls.io/repos/github/2motion/emotion-be/badge.svg?branch=master' alt='Coverage Status' />
  </a>
  <a href="https://deepscan.io/dashboard#view=project&tid=4889&pid=11864&bid=176903"><img src="https://deepscan.io/api/teams/4889/projects/11864/branches/176903/badge/grade.svg" alt="DeepScan grade"></a>
  <a href="https://img.shields.io/uptimerobot/ratio/m785027016-80b0e125589d07f9d329dbc2">
    <img src="https://img.shields.io/uptimerobot/ratio/m785027016-80b0e125589d07f9d329dbc2" alt="uptime" />
  </a>
</p>


GAMSTAGRAM:BE 는 NestJS 로 만들어진 `오픈 소스` 프로젝트 입니다.
언제든 Fork 하여 사용하실 수 있고, 해당 레포지토리 이슈 페이지를 통해 contribution 할 수 있습니다.
NestJS 는 Angular 에서 Insight 를 받은 Typescript 로 제작된 서버사이드 프레임워크 입니다.
궁극적으로 FE 와 BE 의 디자인 패턴을 일원화하여 유연하게 구성할 수 있는 이상적인 형태를 지향하고 있습니다.

FRP (Functional Reactive Programming) 형태로 구성했으며, 관련된 기술 스택과 사용한 기술에 대해 작성한 글은 아래 목록에서 소개하고 있으니 궁금하신분은 아래 내용을 참고해주시면 감사하겠습니다.

## Running the app

앱을 구동하면 기본적으로 코드에 기재된 내용에 따라 자동으로 swagger 형태로 REST API 명세르 제공한다.
`://{host}/swagger` 경로를 통해 확인 할 수 있다.

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

Before reading the this section, please refer to the material you studied with in the past([tdd-study](http://stash.devignlab.com/projects/CELL-NODE/repos/tdd-study/browse))

Automated testing is considered an essential part of any serious software development effort. Automation makes it easy to repeat individual tests or test suites quickly and easily during development. This helps ensure that releases meet quality and performance goals. Automation helps increase coverage and provides a faster feedback loop to developers. Automation both increases the productivity of individual developers and ensures that tests are run at critical development lifecycle junctures, such as source code control check-in, feature integration, and version release.

Such tests often span a variety of types, including unit tests, end-to-end (e2e) tests, integration tests, and so on. While the benefits are unquestionable, it can be tedious to set them up. Nest strives to promote development best practices, including effective testing, so it includes features such as the following to help developers and teams build and automate tests. Nest:

automatically scaffolds default unit tests for components and e2e tests for applications
provides default tooling (such as a test runner that builds an isolated module/application loader)
provides integration with [Jest](https://github.com/facebook/jest) and [Supertest](https://github.com/visionmedia/supertest) out-of-the-box, while remaining agnostic to testing tools
makes the Nest dependency injection system available in the testing environment for easily mocking components
As mentioned, you can use any **testing framework** that you like, as Nest doesn't force any specific tooling. Simply replace the elements needed (such as the test runner), and you will still enjoy the benefits of Nest's ready-made testing facilities

You can define your test codes with reference to this [Unit](https://docs.nestjs.com/fundamentals/testing#unit-testing) and [E2E](https://docs.nestjs.com/fundamentals/testing#end-to-end-testing) document.

And running your test codes.

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# stress tests
$ npm run test:stress

# test coverage
$ npm run test:cov
```


## Project Stack

- Node.js
- Typescript
- RxJS
- Serverless
- Sequelize
- Elastic Search
- NestJS
- Grafana

## Usage aws resource

- Lambda
- Cloud Formation
- Cloud Front
- Cloud Watch
- SES
- SNS
- ROUTE 53
- S3
- RDS
- SQS

## Recommends article

- [나는 코드를 쓸테니, 너는 인프라를 맡거라.](https://blog.hax0r.info/2018-11-28/i-will-write-the-code-you-will-be-in-charge-of-the-infrastructure/)
- [Getting Started with Functional Reactive Programming Using RxJS](https://blog.hax0r.info/2018-05-10/getting-started-with-functional-reactive-programming-using-rxjs/)
- [Reactive Programming](https://blog.hax0r.info/2018-05-09/reactive-programming/)

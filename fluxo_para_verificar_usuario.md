mudar nome da tabela EmailVerification para UserEmailVerification
adicionar em novo model coluna verified ou is_verified

criar model MemberEmailVerification identica a UserEmailVerification para salvar os registros de verificação de email de um membro

para cada model (UserEmailVerification e MemberEmailVerification) devemos ter uma pasta para sua organização conforme organização de nosso projeto (conforme descrito no documento README.md)

quando fluxo de src/modules/user/services/create-user.service.ts criar usuario for executado apos criar novo usuario 
com const newUser = await this.userRepository.createUser executamos o service de criar um registro em UserEmailVerification

neste primeiro momento monte a estrutura apenas para UserEmailVerification e invoque a criação de registro em src/modules/user/services/create-user.service.ts

pipeline {
    agent any

    environment {
        GITHUB_CREDENTIALS = 'github-pat'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/feature/ci-cd-pipeline']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/igentihor/tesk-api.git',
                        credentialsId: "${GITHUB_CREDENTIALS}"
                    ]]
                ])
            }
        }
    }
}

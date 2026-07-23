pipeline {
    agent any

    environment {
        GITHUB_CREDENTIALS = 'github-pat'
        PATH = "/Users/rohit.negi/.nvm/versions/node/v20.9.0/bin:${env.PATH}"
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }
}

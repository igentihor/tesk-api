pipeline {
    agent any

    environment {
        GITHUB_CREDENTIALS = 'github-pat'
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
    }
}

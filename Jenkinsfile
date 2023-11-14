pipeline {
    agent any
    tools {
        nodejs '18.16.0'
    }
    stages {
        stage('Setup') {
            steps {
                script {
                    sh 'npm version'
                    sh 'yarn install'
                    sh 'yarn global add typescript@4.4.3'
                }
            }
        }
    }
}


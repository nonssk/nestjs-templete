pipeline {
    agent any

    tools {
        nodejs 'node_18_16_0'
    }

    stages {
        stage('Install') {
            steps {
                script {
                    sh 'npm install -g typescript@4.5.5'
                    sh 'yarn install'
                }
            }
        }
    }
}


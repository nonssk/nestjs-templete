pipeline {
    agent any

    tools {
        nodejs 'node_18_16_0'
    }

    stages {
        stage('Install') {
            steps {
                script {
                    sh 'yarn install'
                }
            }
        }
    }
}


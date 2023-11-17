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
        stage('check version') {
            steps {
                script {
                    def version = sh(script: "yarn version", returnStdout: true).trim()
                    env.VERSION = version
                    echo "Building and testing version ${env.VERSION}"
                }
            }
        }
    }
}


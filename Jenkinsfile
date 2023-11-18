pipeline {
    agent any

    tools {
        nodejs 'node_18_16_0'
    }

    environment {
        PROJECT_NAME = 'nest-templete'
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
                    def version = sh(script: 'node -pe "require(\'./package.json\').version"', returnStdout: true).trim()
                    env.VERSION = version
                    echo "Install project ${PROJECT_NAME} version ${env.VERSION}"
                }
            }
        }
        stage('build') {
            steps {
                script {
                    echo "Build project ${PROJECT_NAME} version ${env.VERSION}"
                    sh 'cp .env.example .env'
                    sh "docker build -t ${PROJECT_NAME} ."
                }
            }
        }
        stage('public') {
            steps {
                script {
                    sh "docker login -u nonssk403 -p dckr_pat_kNNn2pcFGwxRcjB-2mYDili0I8s"
                    sh "docker tag ${PROJECT_NAME} nonssk403/nest-templete:${env.VERSION}"
                    sh "docker push nonssk403/nest-templete:${env.VERSION}"
                }
            }
        }
    }
}


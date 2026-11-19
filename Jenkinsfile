pipeline {
    agent any

    environment {
        // Jenkins on macOS does not see Homebrew's PATH, so add it for node/npm/npx.
        PATH = "/usr/local/bin:/opt/homebrew/bin:${env.PATH}"
        // Turns on CI behaviour in playwright.config.ts (retries, 1 worker, forbidOnly).
        CI = 'true'
    }

    options {
        timeout(time: 60, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '20'))
    }

    triggers {
        // Check GitHub for new commits every 1 minute.
        pollSCM('H/1 * * * *')
    }

    stages {
        stage('Install dependencies') {
            steps {
                sh 'node -v && npm -v'
                sh 'npm ci'
            }
        }

        stage('Install browsers') {
            steps {
                sh 'npx playwright install chromium'
            }
        }

        stage('Run Playwright tests') {
            steps {
                sh 'npx playwright test'
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true, testResults: 'junit-results/results.xml'
            publishHTML(target: [
                reportName           : 'Playwright Report',
                reportDir            : 'playwright-report',
                reportFiles          : 'index.html',
                keepAll              : true,
                alwaysLinkToLastBuild: true,
                allowMissing         : true
            ])
            archiveArtifacts artifacts: 'playwright-report/**, test-results/**', allowEmptyArchive: true
        }
    }
}

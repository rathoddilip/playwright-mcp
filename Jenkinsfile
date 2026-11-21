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
                // The workspace is reused between builds, so clear old Allure results first.
                sh 'rm -rf allure-results'
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

            // Allure Report: needs the Allure Jenkins plugin and an Allure Commandline
            // tool named 'allure' (Manage Jenkins > Tools).
            allure(
                commandline: 'allure',
                includeProperties: false,
                jdk: '',
                results: [[path: 'allure-results']]
            )

            // Email the result after every build. Recipients come from
            // Manage Jenkins > System > Extended E-mail Notification > Default Recipients,
            // so the address is not stored in this public repo.
            emailext(
                to: '$DEFAULT_RECIPIENTS',
                subject: 'Playwright tests: $BUILD_STATUS - $PROJECT_NAME #$BUILD_NUMBER',
                mimeType: 'text/html',
                attachmentsPattern: 'playwright-report/index.html',
                body: '''
                    <h2>Build $BUILD_STATUS: $PROJECT_NAME #$BUILD_NUMBER</h2>
                    <p>
                      <b>Tests:</b> ${TEST_COUNTS, var="total"} total,
                      ${TEST_COUNTS, var="pass"} passed,
                      ${TEST_COUNTS, var="fail"} failed,
                      ${TEST_COUNTS, var="skip"} skipped
                    </p>
                    <p><b>Commit:</b> ${GIT_REVISION, length=7}</p>
                    <p>
                      <a href="${BUILD_URL}allure/">Allure Report</a> |
                      <a href="${BUILD_URL}Playwright_20Report/">Playwright Report</a> |
                      <a href="${BUILD_URL}testReport/">Test Results</a> |
                      <a href="${BUILD_URL}console">Console Output</a>
                    </p>
                    <p>The full HTML report is attached (open index.html in a browser).</p>
                    <h3>Failed tests</h3>
                    ${FAILED_TESTS}
                '''
            )
        }
    }
}

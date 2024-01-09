node {
    def repourl = "${REGISTRY_URL}/${PROJECT_ID}/${ARTIFACT_REGISTRY}"
    stage('Checkout') {
        checkout([$class: 'GitSCM',
        branches: [[name: '*/main']],
        extensions: [],
        userRemoteConfigs: [[credentialsId: 'git',
        url: 'https://github.com/DobreMihai-echo/LongCovidSpaWeb-frontend']]])
    }
    stage('Build and Push Image') {
        withCredentials([file(credentialsId: 'gcp', variable: 'GC_KEY')]) {
            sh("gcloud auth activate-service-account --key-file=${GC_KEY}")
            sh 'gcloud auth configure-docker us-west4-docker.pkg.dev'
            sh 'docker build -t ${REGISTRY_URL}/${PROJECT_ID}/${ARTIFACT_REGISTRY}/longcovid .'
            sh 'gcloud docker -- push ${REGISTRY_URL}/${PROJECT_ID}/${ARTIFACT_REGISTRY}/longcovid'
        }

    }
    stage('Deploy') {
        sh "sed -i 's|IMAGE_URL|${repourl}|g' k8s/deployment.yaml"
        step([$class: 'KubernetesEngineBuilder',
             projectId: env.PROJECT_ID,
             clusterName: env.CLUSTER,
             location: env.ZONE,
             manifestPattern: 'k8s/deployment.yaml',
             credentialsId: env.PROJECT_ID,
             verifyDeployments: true])
    }
}
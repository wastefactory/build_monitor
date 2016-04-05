package com.buildmonitor

class ProxyController {

    def proxyRedirect() {
        redirect(url: "http://192.168.103.37:8080/view/Nucleus/api/json?pretty=true")
    }
}

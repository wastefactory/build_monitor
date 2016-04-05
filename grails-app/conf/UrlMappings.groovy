class UrlMappings {

	static mappings = {
        "/proxy/**"(action: "proxyRedirect", controller: "proxy")
//        "/$controller/$action?/$id?(.$format)?"{
//            constraints {
//                // apply constraints here
//            }
//        }

        //"/"(view:"/index")
        "500"(view:'/error')
	}
}

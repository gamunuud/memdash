'''Main server entre'''

import os
import os.path
import cherrypy
from controller import root, admin, graph, daemon
from cherrypy.process.plugins import Monitor


def main():
    '''Main server entre'''
    cherrypy.config.update({'server.socket_port': 8090})

    conf = {
        '/': {
            'tools.sessions.on': False,
            'tools.caching.on': True,
            'tools.expires.on': True,
            'tools.expires.secs': 2592000,
            'tools.gzip.mime_types': ['text/*'],
            'tools.gzip.on': True,
            'tools.staticdir.root': os.path.abspath(os.getcwd())
        },
        '/static': {
            'tools.staticdir.on': True,
            'tools.gzip.mime_types': ['text/*'],
            'tools.gzip.on': True,
            'tools.staticdir.content_types': {
                'woff': 'application/font-woff'
                },
            'tools.staticdir.dir': './public'
        }
    }
    
    # Do not uncomment this will whipe whole database
    # cherrypy.engine.subscribe('stop', db.cleanup_database)

    page = root.Root()
    page.admin = admin.Admin()
    page.graph = graph.Graph()
    c_daemon = daemon.Daemon()
    Monitor(cherrypy.engine, c_daemon.execute, frequency=30).subscribe()

    cherrypy.quickstart(page, '/', conf)

if __name__ == '__main__':
    main()

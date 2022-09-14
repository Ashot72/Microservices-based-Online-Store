import 'bootstrap/dist/css/bootstrap.css'
import axios from 'axios'

export default ({ req }: any) =>
  typeof window === 'undefined'
    ? axios.create({
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers
    })
    : axios.create({
      baseURL: '/'
    })
import json
from channels.generic.websocket import WebsocketConsumer

class TaskConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        task = text_data_json['task']

        self.send(text_data=json.dumps({
            'task': task
        }))

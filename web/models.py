from django.db import models

# Create your models here.


class Endpoints(models.Model):
    endpoint_id = models.AutoField(primary_key=True)
    user = models.CharField(max_length=200)
    computer = models.CharField(max_length=200)
    group_id = models.CharField(max_length=100)
    last_signal = models.DateTimeField()
    activity = models.ForeignKey(
        "MaliciousActivity", on_delete=models.SET_NULL, null=True, blank=True
    )

    def __str__(self):
        return f"{self.user}---{self.computer}"


class Alerts(models.Model):
    alert_id = models.AutoField(primary_key=True)
    integrity_level = models.CharField(max_length=200)
    role_name = models.CharField(max_length=200)
    description = models.CharField(max_length=500)
    system_time = models.DateTimeField()
    endpoint = models.ForeignKey(
        "Endpoints",
        on_delete=models.CASCADE,
    )

    @property
    def user(self):
        return self.endpoint.user

    @property
    def computer(self):
        return self.endpoint.computer

    def __str__(self):
        return f"id:{self.alert_id}-{self.integrity_level}"


class MaliciousActivity(models.Model):
    TYPES = ((0, "Normal"), (1, "EoRS"), (2, "EoTH"))
    activity_id = models.AutoField(primary_key=True)
    activity_type = models.IntegerField(choices=TYPES, default=0)
    event_id = models.CharField(max_length=100)
    image = models.CharField(max_length=500)
    command_line = models.CharField(max_length=500)
    alert = models.ForeignKey("Alerts", on_delete=models.CASCADE)
    endpoint = models.ForeignKey("Endpoints", on_delete=models.CASCADE)

    @property
    def system_time(self):
        return self.alert.system_time

    def __str__(self):
        return f"id:{self.activity_id}-{self.activity_type}"

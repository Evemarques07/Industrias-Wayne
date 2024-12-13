from sqlalchemy.orm import Session
from app.models import User, Equipment, Vehicle, Device
from app.utils.password import hash_password
from app.database import SessionLocal

def initialize_database():
    db: Session = SessionLocal()
    try:
        # Verificar se o CEO já está cadastrado
        existing_ceo = db.query(User).filter(User.role == "ceo").first()
        if not existing_ceo:
            hashed_password = hash_password("robin")
            ceo_user = User(
                username="Bruce Wayne",
                hashed_password=hashed_password,
                role="ceo",
            )
            db.add(ceo_user)
            db.commit()
            print("Usuário CEO 'Bruce Wayne' criado com sucesso!")
        else:
            print("Usuário CEO já existente.")

        # Inserir Equipamentos
        equipment_data = [
            {
                "name": "Armadura Tática WayneTech",
                "description": "Armadura avançada, projetada para fornecer máxima proteção sem comprometer a mobilidade. Desenvolvida com materiais compostos leves e resistentes.",
                "image_url": "https://i.pinimg.com/236x/40/5c/f8/405cf8dd946e7bfd3a7b5a53621aca07.jpg",
            },
            {
                "name": "Visor Tático MULTI-VIS MK-III",
                "description": "Máscara equipada com um visor multi-funcional de realidade aumentada, projetada para fornecer vantagem tática em operações noturnas e de alta tecnologia.",
                "image_url": "https://a-static.mlcdn.com.br/800x600/mascara-eletronica-batman-armor-up-com-luz-e-som-dc-comics/focosimportacaoeexportacaoltda/3384/6745b107ab6e4a0112df9c0b8e9d7b9f.jpeg",
            },
            {
                "name": "Bat-Grapple grappling Hook R-10",
                "description": "Dispositivo portátil de propulsão com gancho retrátil, projetado para escalada rápida, deslocamento em altura e resgates.",
                "image_url": "https://factoryent.com/cdn/shop/files/Batman_The_2022_GrappleLauncher002.png?v=1685466540&width=1100",
            },
        ]
        for equipment in equipment_data:
            existing_equipment = db.query(Equipment).filter(Equipment.name == equipment["name"]).first()
            if not existing_equipment:
                db.add(Equipment(**equipment))
        db.commit()
        print("Equipamentos inseridos com sucesso!")

        # Inserir Veículos
        vehicle_data = [
            {
                "name": "Batmóvel Bat1",
                "description": "Veículo de combate com design aerodinâmico, longo e elegante. Possui características de alta velocidade e estética sofisticada, inspirado em carros clássicos combinados com elementos futuristas.",
                "image_url": "https://i.pinimg.com/236x/14/c3/db/14c3db83667ed38c1101607536f81607.jpg",
            },
            {
                "name": "Batmóvel série Militarizada",
                "description": "Veículo híbrido, com estrutura reforçada e estética robusta, adequado tanto para operações urbanas quanto para missões estratégicas de combate.",
                "image_url": "https://i.pinimg.com/236x/17/47/b5/1747b5f06b2aa7acea76b24bff7f8452.jpg",
            },
            {
                "name": "Batmóvel Tumbler",
                "description": "Veículo de combate inspirado em tanques militares, projetado para resistência máxima e manobras em terrenos difíceis. Seu design angular e imponente reflete a prioridade em força e combate pesado.",
                "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzutkw8VoOLOvB3OyuJmI7wps8AwXEjlV8AY5-YGA7TBg9Frub4eVIQgoWiOmadzi82hI&usqp=CAU",
            },
        ]
        for vehicle in vehicle_data:
            existing_vehicle = db.query(Vehicle).filter(Vehicle.name == vehicle["name"]).first()
            if not existing_vehicle:
                db.add(Vehicle(**vehicle))
        db.commit()
        print("Veículos inseridos com sucesso!")

        # Inserir Dispositivos
        device_data = [
            {
                "name": "Batarang",
                "description": "Arma de arremesso multifuncional com design inspirado em um morcego, projetada para combate corpo a corpo, desarme de inimigos e tarefas de precisão.",
                "image_url": "https://1542928830.rsc.cdn77.org/temp/1700067073_ec162e550d8c17be4478b71ebf45fd9d.jpg",
            },
            {
                "name": "Lançador de Granadas de Fumaça WayneTech SMG-4",
                "description": "Dispositivo portátil projetado para gerar cobertura em situações de retirada, distração ou infiltração em áreas hostis.",
                "image_url": "https://acdn.mitiendanube.com/stores/001/100/518/products/11137390282-9e35089f8765dae8943ac87ab12c4f51-c90545baa04789d54716122782684509-1024-1024.jpg",
            },
            {
                "name": "Disruptor WayneTech T-9",
                "description": "Arma portátil não-letal, projetada para incapacitar temporariamente inimigos ou desativar dispositivos eletrônicos.",
                "image_url": "https://static.wikia.nocookie.net/warframe/images/f/fd/DECorpusHandCannon.png/revision/latest/scale-to-width-down/220?cb=20180329052508&path-prefix=pt",
            },
        ]
        for device in device_data:
            existing_device = db.query(Device).filter(Device.name == device["name"]).first()
            if not existing_device:
                db.add(Device(**device))
        db.commit()
        print("Dispositivos inseridos com sucesso!")

    finally:
        db.close()

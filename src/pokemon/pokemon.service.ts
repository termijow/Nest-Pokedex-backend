import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId  } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()


export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService
  ) {
    // console.log(process.env.DEFAULT_LIMIT)
    // console.log(configService.get('default_limit'))
  }
  
  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const {limit = this.configService.get<number>('default_limit'), offset = 0} = paginationDto 
    return this.pokemonModel.find().limit(limit).skip(offset).sort({
      no:1,
    },
    )
    .select('-__v')
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    if ( !isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({no: term })
    }

    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term)
    }

    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({name: term.toLowerCase().trim()})
    }

    if (!pokemon)
      throw new NotFoundException(`Pokemon con el ID, nombre o numero ${term} no se encontró`);

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);



    try {
      if(updatePokemonDto.name) {
        updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
  
        await pokemon.updateOne(updatePokemonDto);
        return {...pokemon.toJSON(), ...updatePokemonDto };
      }
    } catch (error) {
      this.handleExceptions(error);
    }


  }

  async remove(id: string) {

    const { deletedCount } = await this.pokemonModel.deleteOne({_id: id})
    if (deletedCount === 0) {
      throw new BadRequestException( `El objeto en la base de datos con ${id} no existe!`);
    } else { 
      return deletedCount;
    }
  }

  async removeAll() {
    return this.pokemonModel.deleteMany({})
  }


  private handleExceptions(error:any) {
    if (error.code === 11000) {
      throw new BadRequestException(`Este Pokemon ya existe en la base de datos ${JSON.stringify(error.keyValue)}`)
    }
    console.log(error);
    throw new InternalServerErrorException(`No se pudo crear el pokemon, revisa los logs del servidor`)
  
  }
}
